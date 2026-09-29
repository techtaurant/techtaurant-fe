'use client';

import { useRouter } from 'next/navigation';

import { toast } from '@/shared/ui/toast';
import type { PostWriteAutoSaveResult } from '@/views/post-write/model/use-post-write-auto-save';

const DRAFT_LIST_PATH = '/write/drafts';
const DRAFT_LIST_OPEN_FAILED_MESSAGE = '저장하지 못해 목록을 열 수 없어요. 잠시 후 다시 시도해주세요.';

type Params = {
  flushPendingSave: () => Promise<PostWriteAutoSaveResult>;
};

export const useOpenDraftList = ({ flushPendingSave }: Params) => {
  const router = useRouter();

  const openDraftList = async () => {
    const result = await flushPendingSave();

    if (result === 'failed') {
      toast.error(DRAFT_LIST_OPEN_FAILED_MESSAGE);
      return;
    }

    router.push(DRAFT_LIST_PATH);
  };

  return openDraftList;
};
