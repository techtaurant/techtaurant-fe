'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { getSearchParamValue } from '@/shared/lib/search-params';

export const DRAFT_ID_SEARCH_PARAM_KEY = 'draftId';

export const useDraftIdSearchParam = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const draftId = getSearchParamValue(searchParams, DRAFT_ID_SEARCH_PARAM_KEY);

  const replaceDraftId = (nextDraftId: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(DRAFT_ID_SEARCH_PARAM_KEY, nextDraftId);

    window.history.replaceState(null, '', `?${newSearchParams.toString()}`);
  };

  const clearDraftId = useCallback(() => {
    router.replace(pathname);
  }, [pathname, router]);

  return { clearDraftId, draftId, replaceDraftId };
};
