'use client';

import { toast } from '@/shared/ui/toast';
import { useDraftListSearchParam } from '@/views/post-write/model/use-draft-list-search-param';
import type { PostWriteAutoSaveResult } from '@/views/post-write/model/use-post-write-auto-save';

const DRAFT_SWITCH_FAILED_MESSAGE = '저장하지 못해 다른 글로 전환할 수 없어요. 잠시 후 다시 시도해주세요.';

type Params = {
  flushPendingSave: () => Promise<PostWriteAutoSaveResult>;
  onDraftSwitch: () => void;
};

export const useDraftListNavigation = ({ flushPendingSave, onDraftSwitch }: Params) => {
  const { closeDraftList, isDraftListOpen, openDraftList, selectDraftAndCloseList } = useDraftListSearchParam();

  const selectDraft = async (selectedDraftId: string) => {
    const result = await flushPendingSave();

    if (result === 'failed') {
      toast.error(DRAFT_SWITCH_FAILED_MESSAGE);
      return;
    }

    onDraftSwitch();
    selectDraftAndCloseList(selectedDraftId);
  };

  return { closeDraftList, isDraftListOpen, openDraftList, selectDraft };
};
