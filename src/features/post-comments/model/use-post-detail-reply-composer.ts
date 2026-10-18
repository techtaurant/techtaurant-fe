'use client';

import { useState } from 'react';

import { useGetMe } from '@/entities/user';
import { useCreatePostDetailComment } from '@/features/post-comments/model/use-create-post-detail-comment';

type Params = {
  onReplyCreated: (parentCommentId: string) => void;
  onRequireLogin: () => void;
};

type ReplyDraft = {
  parentCommentId: string;
  postId: string;
  value: string;
};

export const usePostDetailReplyComposer = ({ onReplyCreated, onRequireLogin }: Params) => {
  const [replyDraft, setReplyDraft] = useState<ReplyDraft | null>(null);
  const [replyFocusRequestKey, setReplyFocusRequestKey] = useState(0);

  const { data: me, isPending: isAuthPending } = useGetMe();
  const { createComment, isCommentCreating } = useCreatePostDetailComment({ onRequireLogin });
  const isLoggedIn = !!me;

  const openReplyComposer = (commentId: string, postId: string) => {
    setReplyDraft({ parentCommentId: commentId, postId, value: '' });
    setReplyFocusRequestKey((current) => current + 1);
  };

  const cancelReply = () => {
    setReplyDraft(null);
  };

  const createReply = async () => {
    if (!replyDraft || isCommentCreating) return;

    const { parentCommentId, postId, value } = replyDraft;

    const isCreated = await createComment({
      content: value,
      parentId: parentCommentId,
      postId,
    });
    if (!isCreated) return;

    setReplyDraft((current) => {
      if (current?.parentCommentId !== parentCommentId) return current;

      return { ...current, value: '' };
    });
    onReplyCreated(parentCommentId);
    setReplyFocusRequestKey((current) => current + 1);
  };

  const handleReplyButtonClick = (commentId: string, postId: string) => {
    if (isAuthPending || isCommentCreating) return;
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }
    if (replyDraft?.parentCommentId === commentId) {
      setReplyFocusRequestKey((current) => current + 1);
      return;
    }

    openReplyComposer(commentId, postId);
  };

  const handleReplyValueChange = (value: string) => {
    setReplyDraft((current) => {
      if (!current) return current;

      return { ...current, value };
    });
  };

  const handleCreateReply = () => {
    void createReply();
  };

  const isReplyingToComment = (commentId: string) => {
    return replyDraft?.parentCommentId === commentId;
  };

  return {
    cancelReply,
    handleCreateReply,
    handleReplyButtonClick,
    handleReplyValueChange,
    isReplyButtonDisabled: isAuthPending || isCommentCreating,
    isReplyingToComment,
    isReplySubmitting: isCommentCreating,
    replyFocusRequestKey,
    replyValue: replyDraft?.value ?? '',
  };
};
