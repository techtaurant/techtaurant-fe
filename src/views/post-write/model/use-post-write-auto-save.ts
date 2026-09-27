'use client';

import { useCallback, useEffect, useRef } from 'react';

import { toast } from '@/shared/ui/toast';
import type { PostDraft } from '@/views/post-write/model/post-draft';

const AUTO_SAVE_DEBOUNCE_MS = 30_000;
const AUTO_SAVE_RETRY_INITIAL_DELAY_MS = 5_000;
const AUTO_SAVE_MAX_RETRY_COUNT = 2;

const AUTO_SAVE_FAILED_MESSAGE = '자동 저장에 실패했어요.';

type PostWriteAutoSaveResult = 'saved' | 'failed';

type Params = {
  draft: PostDraft;
  hasUnsavedChanges: boolean;
  onSaveSuccess: () => void;
  save: (draft: PostDraft) => Promise<void>;
};

export const usePostWriteAutoSave = ({ draft, hasUnsavedChanges, onSaveSuccess, save }: Params) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hasWarnedRef = useRef(false);
  const retryCountRef = useRef(0);
  const saveGenerationRef = useRef(0);
  const isSavingRef = useRef(false);

  const draftRef = useRef(draft);
  const saveRef = useRef(save);
  const onSaveSuccessRef = useRef(onSaveSuccess);

  useEffect(() => {
    draftRef.current = draft;
    saveRef.current = save;
    onSaveSuccessRef.current = onSaveSuccess;
  });

  const cancelScheduledSave = useCallback(() => {
    saveGenerationRef.current += 1;

    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = undefined;
  }, []);

  const runSave = useCallback(async (): Promise<PostWriteAutoSaveResult> => {
    const sentDraft = draftRef.current;
    isSavingRef.current = true;

    try {
      await saveRef.current(sentDraft);
      hasWarnedRef.current = false;
      if (draftRef.current === sentDraft) onSaveSuccessRef.current();
      return 'saved';
    } catch {
      return 'failed';
    } finally {
      isSavingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const scheduleSave = (delayMs: number) => {
      const saveGeneration = saveGenerationRef.current;

      timerRef.current = setTimeout(async () => {
        if (isSavingRef.current) {
          scheduleSave(AUTO_SAVE_DEBOUNCE_MS);
          return;
        }

        const result = await runSave();

        if (saveGeneration !== saveGenerationRef.current) return;
        if (result !== 'failed') return;

        if (!hasWarnedRef.current) {
          hasWarnedRef.current = true;
          toast.error(AUTO_SAVE_FAILED_MESSAGE);
        }

        if (retryCountRef.current >= AUTO_SAVE_MAX_RETRY_COUNT) return;

        const retryDelayMs = AUTO_SAVE_RETRY_INITIAL_DELAY_MS * 2 ** retryCountRef.current;
        retryCountRef.current += 1;
        scheduleSave(retryDelayMs);
      }, delayMs);
    };

    retryCountRef.current = 0;
    scheduleSave(AUTO_SAVE_DEBOUNCE_MS);

    return cancelScheduledSave;
  }, [cancelScheduledSave, draft, hasUnsavedChanges, runSave]);

  return { cancelScheduledSave };
};
