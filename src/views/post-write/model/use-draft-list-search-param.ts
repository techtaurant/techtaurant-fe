'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { getSearchParamValue } from '@/shared/lib/search-params';
import { DRAFT_ID_SEARCH_PARAM_KEY } from '@/views/post-write/model/use-draft-id-search-param';

const DRAFT_LIST_SEARCH_PARAM_KEY = 'draftList';
const DRAFT_LIST_SEARCH_PARAM_OPEN_VALUE = '1';

export const useDraftListSearchParam = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isDraftListOpen =
    getSearchParamValue(searchParams, DRAFT_LIST_SEARCH_PARAM_KEY) === DRAFT_LIST_SEARCH_PARAM_OPEN_VALUE;

  const updateSearchParams = (method: 'push' | 'replace', updater: (newSearchParams: URLSearchParams) => void) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    updater(newSearchParams);

    router[method](`?${newSearchParams.toString()}`);
  };

  const openDraftList = () => {
    updateSearchParams('push', (newSearchParams) => {
      newSearchParams.set(DRAFT_LIST_SEARCH_PARAM_KEY, DRAFT_LIST_SEARCH_PARAM_OPEN_VALUE);
    });
  };

  const closeDraftList = () => {
    router.back();
  };

  const selectDraftAndCloseList = (nextDraftId: string) => {
    updateSearchParams('replace', (newSearchParams) => {
      newSearchParams.delete(DRAFT_LIST_SEARCH_PARAM_KEY);
      newSearchParams.set(DRAFT_ID_SEARCH_PARAM_KEY, nextDraftId);
    });
  };

  return { closeDraftList, isDraftListOpen, openDraftList, selectDraftAndCloseList };
};
