'use client';

import type { CSSProperties, SyntheticEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useGetMe } from '@/entities/user';
import {
  COMMENT_FOCUS_DELAY_MS,
  COMMENT_TEXTAREA_COLLAPSED_HEIGHT,
  COMMENT_TEXTAREA_EXPANDED_HEIGHT,
  COMMENT_TEXTAREA_EXPANDED_MAX_HEIGHT,
} from '@/features/post-comments/config/comment-composer';
import { useCreatePostDetailComment } from '@/features/post-comments/model/use-create-post-detail-comment';
import { cn } from '@/shared/lib/cn';

type Props = {
  focusRequestKey: number;
  onRequireLogin: () => void;
  postId: string;
};

const COMMENT_PLACEHOLDER = '의견을 나눠주세요!';
const COMMENT_SUBMIT_LABEL = '댓글';
const COMMENT_CANCEL_LABEL = '취소';

export function PostDetailCommentComposer({ focusRequestKey, onRequireLogin, postId }: Props) {
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCommentExpanded, setIsCommentExpanded] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const { data: me, isPending: isAuthPending } = useGetMe();
  const { clearCreateCommentError, createComment, createCommentErrorMessage, isCommentCreating } =
    useCreatePostDetailComment({ onRequireLogin });
  const textareaSizeStyle = {
    height: isCommentExpanded ? undefined : COMMENT_TEXTAREA_COLLAPSED_HEIGHT,
    maxHeight: isCommentExpanded ? COMMENT_TEXTAREA_EXPANDED_MAX_HEIGHT : COMMENT_TEXTAREA_COLLAPSED_HEIGHT,
    minHeight: isCommentExpanded ? COMMENT_TEXTAREA_EXPANDED_HEIGHT : COMMENT_TEXTAREA_COLLAPSED_HEIGHT,
  } satisfies CSSProperties;

  const resetCommentForm = () => {
    clearCreateCommentError();
    setCommentValue('');
    setIsCommentExpanded(false);

    if (commentTextareaRef.current) {
      commentTextareaRef.current.style.height = COMMENT_TEXTAREA_COLLAPSED_HEIGHT;
    }
  };

  const handleCancelButtonClick = () => {
    resetCommentForm();
  };

  const handleCommentTextareaInput = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSubmitButtonClick = async () => {
    const isCreated = await createComment({ content: commentValue, postId });
    if (!isCreated) return;

    resetCommentForm();
  };

  const handleCommentValueChange = (nextCommentValue: string) => {
    setCommentValue(nextCommentValue);
    if (!createCommentErrorMessage) return;

    clearCreateCommentError();
  };

  const handleCommentTextareaFocus = () => {
    if (isAuthPending) {
      commentTextareaRef.current?.blur();
      return;
    }
    if (!me) {
      commentTextareaRef.current?.blur();
      onRequireLogin();
      return;
    }

    setIsCommentExpanded(true);
    if (!commentTextareaRef.current || commentValue) return;

    commentTextareaRef.current.style.height = COMMENT_TEXTAREA_EXPANDED_HEIGHT;
  };

  const handleCommentSubmitButtonClick = () => {
    void handleSubmitButtonClick();
  };

  useEffect(() => {
    if (focusRequestKey <= 0) return;

    commentTextareaRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    const timeoutId = setTimeout(() => {
      commentTextareaRef.current?.focus();
    }, COMMENT_FOCUS_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [focusRequestKey]);

  return (
    <div className="mb-3">
      <div className="flex-1">
        <div className="relative">
          <textarea
            ref={commentTextareaRef}
            disabled={isCommentCreating}
            placeholder={isCommentExpanded ? '' : COMMENT_PLACEHOLDER}
            value={commentValue}
            className={cn(
              'border-border bg-background scrollbar-hidden w-full resize-none rounded-xl border px-4 text-base transition-colors duration-200',
              'placeholder:text-base focus:outline-none',
              'hover:bg-comment-input-hover focus:bg-comment-input-hover active:bg-comment-input-hover',
              createCommentErrorMessage
                ? 'border-form-error-border focus:border-form-error-border'
                : 'border-border focus:border-border',
              isCommentExpanded
                ? 'overflow-y-auto pt-3 pb-14 text-left'
                : 'overflow-hidden pt-2.5 pb-2.5 text-left leading-5.5',
            )}
            rows={1}
            style={textareaSizeStyle}
            onChange={(event) => handleCommentValueChange(event.target.value)}
            onFocus={handleCommentTextareaFocus}
            onInput={handleCommentTextareaInput}
          />
          {isCommentExpanded && (
            <div className="absolute right-3 bottom-4 flex items-center gap-2">
              <button
                type="button"
                disabled={isCommentCreating}
                className={cn(
                  'border-border h-8 rounded-md border px-4 text-sm font-semibold transition-colors duration-200',
                  'text-comment-cancel-button-foreground hover:bg-muted/85 hover:text-foreground disabled:opacity-60',
                )}
                onClick={handleCancelButtonClick}
              >
                {COMMENT_CANCEL_LABEL}
              </button>
              <button
                type="button"
                disabled={isCommentCreating}
                className={cn(
                  'bg-comment-submit-button h-8 rounded-md px-4 text-sm font-semibold text-white transition-colors duration-200',
                  'hover:bg-comment-submit-button-hover disabled:opacity-60',
                )}
                onClick={handleCommentSubmitButtonClick}
              >
                {COMMENT_SUBMIT_LABEL}
              </button>
            </div>
          )}
        </div>
        {createCommentErrorMessage && (
          <p className="text-form-error-foreground mt-2 px-2 text-sm font-medium">{createCommentErrorMessage}</p>
        )}
      </div>
    </div>
  );
}
