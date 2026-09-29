'use client';

import { useSearchParams } from 'next/navigation';

import { getSearchParamValue } from '@/shared/lib/search-params';

export const DRAFT_ID_SEARCH_PARAM_KEY = 'draftId';

export const useDraftIdSearchParam = () => {
  const searchParams = useSearchParams();

  const draftId = getSearchParamValue(searchParams, DRAFT_ID_SEARCH_PARAM_KEY);

  const replaceDraftId = (nextDraftId: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(DRAFT_ID_SEARCH_PARAM_KEY, nextDraftId);

    window.history.replaceState(null, '', `?${newSearchParams.toString()}`);
  };

  return { draftId, replaceDraftId };
};
