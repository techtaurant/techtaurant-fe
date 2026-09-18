'use client';

import { useCallback, useEffect, useRef } from 'react';

import { toast } from '@/shared/ui/toast';
import type { PostDraft } from '@/views/post-write/model/post-draft';

const AUTO_SAVE_DEBOUNCE_MS = 30_000;
const AUTO_SAVE_RETRY_INITIAL_DELAY_MS = 5_000;
const AUTO_SAVE_RETRY_MAX_DELAY_MS = 30_000;

const AUTO_SAVE_FAILED_MESSAGE = '자동 저장에 실패했어요. 계속 시도할게요.';

type PostWriteAutoSaveResult = 'saved' | 'skipped' | 'failed';

type Params = {
  draft: PostDraft;
  hasUnsavedChanges: boolean;
  onSaveSuccess: () => void;
  save: (draft: PostDraft) => Promise<void>;
};

export const usePostWriteAutoSave = ({ draft, hasUnsavedChanges, onSaveSuccess, save }: Params) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const retryDelayRef = useRef(AUTO_SAVE_RETRY_INITIAL_DELAY_MS);
  const hasWarnedRef = useRef(false);

  const draftRef = useRef(draft);
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
  const saveRef = useRef(save);
  const onSaveSuccessRef = useRef(onSaveSuccess);

  useEffect(() => {
    draftRef.current = draft;
    hasUnsavedChangesRef.current = hasUnsavedChanges;
    saveRef.current = save;
    onSaveSuccessRef.current = onSaveSuccess;
  });

  const cancelScheduledSave = useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = undefined;
  }, []);

  const runSave = useCallback(async (): Promise<PostWriteAutoSaveResult> => {
    if (!hasUnsavedChangesRef.current) return 'skipped';

    try {
      await saveRef.current(draftRef.current);
      retryDelayRef.current = AUTO_SAVE_RETRY_INITIAL_DELAY_MS;
      hasWarnedRef.current = false;
      onSaveSuccessRef.current();
      return 'saved';
    } catch {
      return 'failed';
    }
  }, []);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const scheduleSave = (delayMs: number) => {
      timerRef.current = setTimeout(async () => {
        const result = await runSave();

        if (result !== 'failed') return;

        if (!hasWarnedRef.current) {
          hasWarnedRef.current = true;
          toast.error(AUTO_SAVE_FAILED_MESSAGE);
        }

        const retryDelayMs = retryDelayRef.current;
        retryDelayRef.current = Math.min(retryDelayMs * 2, AUTO_SAVE_RETRY_MAX_DELAY_MS);
        scheduleSave(retryDelayMs);
      }, delayMs);
    };

    scheduleSave(AUTO_SAVE_DEBOUNCE_MS);

    return cancelScheduledSave;
  }, [cancelScheduledSave, draft, hasUnsavedChanges, runSave]);

  return { cancelScheduledSave };
};
