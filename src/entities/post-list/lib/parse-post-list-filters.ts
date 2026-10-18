import type {
  PostListFilters,
  PostListPeriodFilter,
  PostListSortFilter,
} from '@/entities/post-list/model/post-list-filters';
import {
  POST_LIST_FILTER_SEARCH_PARAM_KEYS,
  POST_LIST_PERIOD_VALUES,
  POST_LIST_SORT_VALUES,
} from '@/entities/post-list/model/post-list-filters';
import { GetPostsApiPeriod, GetPostsApiSort } from '@/shared/api/generated';
import type { SearchParamsLike } from '@/shared/lib/search-params';
import { getSearchParamValue, getSearchParamValues } from '@/shared/lib/search-params';

const isValidPeriodValue = (value: string | null | undefined): value is PostListPeriodFilter => {
  return Boolean(value && POST_LIST_PERIOD_VALUES.has(value as PostListPeriodFilter));
};

const isValidSortValue = (value: string | null | undefined): value is PostListSortFilter => {
  return Boolean(value && POST_LIST_SORT_VALUES.has(value as PostListSortFilter));
};

const getPostListFilterIds = (values: string[]) => {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
};

export const parsePostListFilters = (searchParams?: SearchParamsLike): PostListFilters => {
  const authorId = getSearchParamValue(searchParams, POST_LIST_FILTER_SEARCH_PARAM_KEYS.authorId)?.trim();
  const period = getSearchParamValue(searchParams, POST_LIST_FILTER_SEARCH_PARAM_KEYS.period);
  const sort = getSearchParamValue(searchParams, POST_LIST_FILTER_SEARCH_PARAM_KEYS.sort);
  const tagIds = getPostListFilterIds(getSearchParamValues(searchParams, POST_LIST_FILTER_SEARCH_PARAM_KEYS.tagIds));

  return {
    ...(!!authorId && { authorId }),
    period: isValidPeriodValue(period) ? period : GetPostsApiPeriod.ALL,
    sort: isValidSortValue(sort) ? sort : GetPostsApiSort.LATEST,
    tagIds,
  };
};
