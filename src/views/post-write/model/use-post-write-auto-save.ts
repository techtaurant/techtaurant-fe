'use client';

import { useCallback, useEffect, useRef } from 'react';

import { toast } from '@/shared/ui/toast';
import type { PostDraft } from '@/views/post-write/model/post-draft';

const AUTO_SAVE_DEBOUNCE_MS = 30_000;
const AUTO_SAVE_RETRY_INITIAL_DELAY_MS = 5_000;
const AUTO_SAVE_MAX_RETRY_COUNT = 2;

const AUTO_SAVE_FAILED_MESSAGE = '자동 저장에 실패했어요.';

export type PostWriteAutoSaveResult = 'saved' | 'failed';

type Params = {
  draft: PostDraft;
  hasUnsavedChanges: boolean;
  isEnabled: boolean;
  onSaveSuccess: () => void;
  save: (draft: PostDraft) => Promise<void>;
};

export const usePostWriteAutoSave = ({ draft, hasUnsavedChanges, isEnabled, onSaveSuccess, save }: Params) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hasWarnedRef = useRef(false);
  const retryCountRef = useRef(0);
  const saveGenerationRef = useRef(0);
  const savePromiseRef = useRef<Promise<PostWriteAutoSaveResult> | null>(null);

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
    saveGenerationRef.current += 1;

    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = undefined;
  }, []);

  const runSave = useCallback(() => {
    const sentDraft = draftRef.current;

    const savePromise = (async (): Promise<PostWriteAutoSaveResult> => {
      try {
        await saveRef.current(sentDraft);
        hasWarnedRef.current = false;
        if (draftRef.current === sentDraft) onSaveSuccessRef.current();
        return 'saved';
      } catch {
        return 'failed';
      } finally {
        savePromiseRef.current = null;
      }
    })();
    savePromiseRef.current = savePromise;

    return savePromise;
  }, []);

  useEffect(() => {
    if (!isEnabled || !hasUnsavedChanges) return;

    const scheduleSave = (delayMs: number) => {
      const saveGeneration = saveGenerationRef.current;

      timerRef.current = setTimeout(async () => {
        if (savePromiseRef.current) {
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
  }, [cancelScheduledSave, draft, hasUnsavedChanges, isEnabled, runSave]);

  const flushPendingSave = async (): Promise<PostWriteAutoSaveResult> => {
    cancelScheduledSave();
    await savePromiseRef.current;
    if (!hasUnsavedChangesRef.current) return 'saved';
    return runSave();
  };

  return { cancelScheduledSave, flushPendingSave };
};
