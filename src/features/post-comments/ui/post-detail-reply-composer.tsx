'use client';

import type { SyntheticEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib/cn';

type Props = {
  focusRequestKey: number;
  isSubmitting: boolean;
  value: string;
  onCancelButtonClick: () => void;
  onChange: (value: string) => void;
  onSubmitButtonClick: () => void;
};

const COMMENT_SUBMIT_LABEL = '댓글';
const COMMENT_CANCEL_LABEL = '취소';
const REPLY_ACTIONS_INLINE_MAX_SCROLL_HEIGHT = 40;

export function PostDetailReplyComposer({
  focusRequestKey,
  isSubmitting,
  value,
  onCancelButtonClick,
  onChange,
  onSubmitButtonClick,
}: Props) {
  const replyTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isActionsBelow, setIsActionsBelow] = useState(false);

  const resizeReplyTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setIsActionsBelow(textarea.scrollHeight > REPLY_ACTIONS_INLINE_MAX_SCROLL_HEIGHT);
  };

  const handleReplyTextareaInput = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    resizeReplyTextarea(event.currentTarget);
  };

  useEffect(() => {
    replyTextareaRef.current?.focus();
  }, [focusRequestKey]);

  useEffect(() => {
    if (value) return;

    const textarea = replyTextareaRef.current;
    if (!textarea) return;

    resizeReplyTextarea(textarea);
  }, [value]);

  return (
    <div className="relative mt-2">
      <textarea
        ref={replyTextareaRef}
        value={value}
        className={cn(
          'border-border bg-background hover:bg-comment-input-hover focus:bg-comment-input-hover active:bg-comment-input-hover focus:border-border scrollbar-hidden min-h-9 w-full resize-none rounded-xl border px-3 py-2 text-sm focus:outline-none',
          isActionsBelow ? 'pr-3' : 'pr-24',
        )}
        rows={1}
        disabled={isSubmitting}
        onChange={(event) => onChange(event.target.value)}
        onInput={handleReplyTextareaInput}
      />
      <div className={cn('flex items-center gap-2', isActionsBelow ? 'mt-2 justify-end' : 'absolute top-1.5 right-2')}>
        <button
          type="button"
          disabled={isSubmitting}
          className={cn(
            'border-border text-muted-foreground flex h-6 min-w-9.25 items-center justify-center rounded-md border px-2 text-[11px] leading-none font-semibold whitespace-nowrap transition-colors duration-200',
            'hover:bg-muted/85 hover:text-foreground disabled:opacity-60',
          )}
          onClick={onCancelButtonClick}
        >
          {COMMENT_CANCEL_LABEL}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          className={cn(
            'bg-save-button flex h-6 min-w-9.25 items-center justify-center rounded-md px-2 text-[11px] leading-none font-bold whitespace-nowrap text-white transition-colors duration-200',
            'hover:bg-save-button-hover disabled:opacity-60',
          )}
          onClick={onSubmitButtonClick}
        >
          {COMMENT_SUBMIT_LABEL}
        </button>
      </div>
    </div>
  );
}
