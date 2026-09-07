import { keepPreviousData } from '@tanstack/react-query';

import { DEFAULT_TAG_LIST_SIZE } from '@/entities/tag/config/constants';
import type { GetTagsApiParams } from '@/shared/api/generated';
import { getGetTagsApiInfiniteQueryKey, useGetTagsApiInfinite } from '@/shared/api/generated';

type Params = {
  enabled?: boolean;
  params?: GetTagsApiParams;
};

const getTagListParams = (params?: GetTagsApiParams): GetTagsApiParams => ({
  size: DEFAULT_TAG_LIST_SIZE,
  ...params,
});

const getTagsQueryKey = (params?: GetTagsApiParams) => {
  return getGetTagsApiInfiniteQueryKey(getTagListParams(params));
};

export const useGetTags = ({ enabled, params }: Params = {}) => {
  return useGetTagsApiInfinite(getTagListParams(params), {
    query: {
      enabled,
      initialPageParam: undefined as GetTagsApiParams['cursor'],
      getNextPageParam: (lastPage) => lastPage.data?.nextCursor ?? undefined,
      placeholderData: keepPreviousData,
      queryKey: getTagsQueryKey(params),
      select: (data) => data.pages.flatMap(({ data }) => data?.content ?? []),
    },
  });
};
