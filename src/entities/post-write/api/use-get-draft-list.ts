import { keepPreviousData } from '@tanstack/react-query';

import { getGetMyDraftsApiInfiniteQueryKey, useGetMyDraftsApiInfinite } from '@/shared/api/generated';

const DRAFT_LIST_PAGE_SIZE = 20;

export const getDraftListQueryKey = () => {
  return getGetMyDraftsApiInfiniteQueryKey({ size: DRAFT_LIST_PAGE_SIZE });
};

export const useGetDraftList = () => {
  return useGetMyDraftsApiInfinite(
    { size: DRAFT_LIST_PAGE_SIZE },
    {
      query: {
        getNextPageParam: (lastPage) => lastPage.data?.nextCursor ?? undefined,
        initialPageParam: undefined as string | undefined,
        placeholderData: keepPreviousData,
        queryKey: getDraftListQueryKey(),
        select: (data) => data.pages.flatMap(({ data }) => data?.content ?? []),
      },
    },
  );
};
