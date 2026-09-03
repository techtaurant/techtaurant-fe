'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { getCommentRepliesQueryKey, getPostCommentsQueryKey, useCreateComment } from '@/entities/comment';
import { getPostDetailQueryKey } from '@/entities/post-detail';
import { getPostListQueryKey } from '@/entities/post-list';
import { useGetMe } from '@/entities/user';
import type { CreateCommentRequest } from '@/shared/api/generated';
import { toast } from '@/shared/ui/toast';

type Params = {
  onRequireLogin: () => void;
};

const COMMENT_CONTENT_REQUIRED_MESSAGE = '댓글 내용을 입력해주세요.';
const COMMENT_CREATE_FAILED_MESSAGE = '댓글 작성에 실패했습니다.';

export const useCreatePostDetailComment = ({ onRequireLogin }: Params) => {
  const [createCommentErrorMessage, setCreateCommentErrorMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: me, isPending: isAuthPending } = useGetMe();
  const createCommentMutation = useCreateComment({
    onSuccess: async ({ parentId, postId }) => {
      const invalidateQueries = [
        queryClient.invalidateQueries({ queryKey: getPostCommentsQueryKey(postId) }),
        queryClient.invalidateQueries({ queryKey: getPostDetailQueryKey(postId) }),
        queryClient.invalidateQueries({ queryKey: getPostListQueryKey() }),
      ];

      if (parentId) {
        invalidateQueries.push(queryClient.invalidateQueries({ queryKey: getCommentRepliesQueryKey(parentId) }));
      }

      await Promise.all(invalidateQueries);
    },
  });
  const isLoggedIn = !!me;

  const ensureLoggedIn = () => {
    if (isAuthPending) return false;
    if (isLoggedIn) return true;

    onRequireLogin();
    return false;
  };

  const createComment = async ({ content, parentId, postId }: CreateCommentRequest) => {
    if (!ensureLoggedIn()) return false;
    if (createCommentMutation.isPending) return false;

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setCreateCommentErrorMessage(COMMENT_CONTENT_REQUIRED_MESSAGE);
      return false;
    }

    setCreateCommentErrorMessage(null);

    try {
      await createCommentMutation.mutateAsync({
        data: {
          content: trimmedContent,
          postId,
          ...(parentId && { parentId }),
        },
      });
      return true;
    } catch {
      setCreateCommentErrorMessage(COMMENT_CREATE_FAILED_MESSAGE);
      toast.error(COMMENT_CREATE_FAILED_MESSAGE);
      return false;
    }
  };

  const clearCreateCommentError = () => {
    setCreateCommentErrorMessage(null);
  };

  return {
    clearCreateCommentError,
    createComment,
    createCommentErrorMessage,
    isCommentCreating: createCommentMutation.isPending,
  };
};
