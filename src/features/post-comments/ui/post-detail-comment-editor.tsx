'use client';

import type { SyntheticEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { CommentItem } from '@/entities/comment';
import { useUpdateComment } from '@/entities/comment';
import { cn } from '@/shared/lib/cn';
import { toast } from '@/shared/ui/toast';

type Props = {
  comment: CommentItem;
  onCancelEdit: () => void;
  onEditSuccess: () => void;
};

const COMMENT_EDIT_CANCEL_LABEL = '취소';
const COMMENT_EDIT_SUBMIT_LABEL = '저장';
const COMMENT_CONTENT_REQUIRED_MESSAGE = '댓글 내용을 입력해주세요.';
const COMMENT_UPDATE_SUCCESS_MESSAGE = '댓글을 수정했어요.';
const COMMENT_UPDATE_FAILED_MESSAGE = '댓글 수정에 실패했습니다.';
const COMMENT_EDITOR_ACTIONS_INLINE_MAX_SCROLL_HEIGHT = 40;

export function PostDetailCommentEditor({ comment, onCancelEdit, onEditSuccess }: Props) {
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [commentContent, setCommentContent] = useState(comment.content);
  const [isEditingActionsBelow, setIsEditingActionsBelow] = useState(false);

  const updateCommentMutation = useUpdateComment();
  const isCommentUpdating = updateCommentMutation.isPending;
  const trimmedCommentContent = commentContent.trim();

  const resizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setIsEditingActionsBelow(textarea.scrollHeight > COMMENT_EDITOR_ACTIONS_INLINE_MAX_SCROLL_HEIGHT);
  };

  const handleCommentContentChange = (value: string) => {
    setCommentContent(value);
  };

  const handleCommentTextareaInput = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    resizeTextarea(event.currentTarget);
  };

  const handleCancelButtonClick = () => {
    onCancelEdit();
  };

  const handleSubmitButtonClick = () => {
    if (!trimmedCommentContent) {
      toast.error(COMMENT_CONTENT_REQUIRED_MESSAGE);
      return;
    }

    updateCommentMutation.mutate(
      {
        commentId: comment.id,
        data: {
          content: trimmedCommentContent,
        },
      },
      {
        onError: () => {
          toast.error(COMMENT_UPDATE_FAILED_MESSAGE);
        },
        onSuccess: () => {
          toast.success(COMMENT_UPDATE_SUCCESS_MESSAGE);
          onEditSuccess();
        },
      },
    );
  };

  useEffect(() => {
    const textarea = editTextareaRef.current;
    if (!textarea) return;

    resizeTextarea(textarea);
    textarea.focus();
  }, []);

  return (
    <div className="relative">
      <textarea
        ref={editTextareaRef}
        value={commentContent}
        className={cn(
          'border-border bg-background scrollbar-hidden hover:bg-comment-input-hover focus:bg-comment-input-hover active:bg-comment-input-hover focus:border-border min-h-9 w-full resize-none rounded-xl border px-3 py-2 text-sm focus:outline-none',
          isEditingActionsBelow ? 'pr-3' : 'pr-24',
        )}
        disabled={isCommentUpdating}
        rows={1}
        onChange={(event) => handleCommentContentChange(event.target.value)}
        onInput={handleCommentTextareaInput}
      />
      <div
        className={cn(
          'flex items-center gap-2',
          isEditingActionsBelow ? 'mt-2 justify-end' : 'absolute top-1.5 right-2',
        )}
      >
        <button
          type="button"
          className={cn(
            'border-border text-muted-foreground flex h-6 min-w-9.25 items-center justify-center rounded-md border px-2 text-[11px] leading-none font-semibold whitespace-nowrap transition-colors duration-200',
            'hover:bg-muted/85 hover:text-foreground disabled:opacity-60',
          )}
          disabled={isCommentUpdating}
          onClick={handleCancelButtonClick}
        >
          {COMMENT_EDIT_CANCEL_LABEL}
        </button>
        <button
          type="button"
          disabled={isCommentUpdating}
          className={cn(
            'bg-save-button flex h-6 min-w-9.25 items-center justify-center rounded-md px-2 text-[11px] leading-none font-bold whitespace-nowrap text-white transition-colors duration-200',
            'hover:bg-save-button-hover disabled:opacity-60',
          )}
          onClick={handleSubmitButtonClick}
        >
          {COMMENT_EDIT_SUBMIT_LABEL}
        </button>
      </div>
    </div>
  );
}
