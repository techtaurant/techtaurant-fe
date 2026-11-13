'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { PostListPeriodFilter, PostListSortFilter } from '@/entities/post-list';
import { parsePostListFilters, POST_LIST_FILTER_SEARCH_PARAM_KEYS } from '@/entities/post-list';

export const usePostListFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = {
    ...parsePostListFilters(searchParams),
    categoryId: searchParams.get(POST_LIST_FILTER_SEARCH_PARAM_KEYS.categoryId) || undefined,
  };

  const pushSearchParams = (nextSearchParams: URLSearchParams) => {
    const queryString = nextSearchParams.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const updateSearchParams = (updater: (nextSearchParams: URLSearchParams) => void) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    updater(nextSearchParams);
    pushSearchParams(nextSearchParams);
  };

  const setPeriodFilter = (period: PostListPeriodFilter) => {
    updateSearchParams((nextSearchParams) => {
      nextSearchParams.set(POST_LIST_FILTER_SEARCH_PARAM_KEYS.period, period);
    });
  };

  const setSortFilter = (sort: PostListSortFilter) => {
    updateSearchParams((nextSearchParams) => {
      nextSearchParams.set(POST_LIST_FILTER_SEARCH_PARAM_KEYS.sort, sort);
    });
  };

  const setAuthorFilter = (authorId?: string) => {
    updateSearchParams((nextSearchParams) => {
      if (!authorId) {
        nextSearchParams.delete(POST_LIST_FILTER_SEARCH_PARAM_KEYS.authorId);
        return;
      }

      nextSearchParams.set(POST_LIST_FILTER_SEARCH_PARAM_KEYS.authorId, authorId);
    });
  };

  const setCategoryFilter = (categoryId?: string) => {
    updateSearchParams((nextSearchParams) => {
      if (!categoryId) {
        nextSearchParams.delete(POST_LIST_FILTER_SEARCH_PARAM_KEYS.categoryId);
        return;
      }

      nextSearchParams.set(POST_LIST_FILTER_SEARCH_PARAM_KEYS.categoryId, categoryId);
    });
  };

  const toggleTagFilter = (tagId: string) => {
    updateSearchParams((nextSearchParams) => {
      const nextTagIds = filters.tagIds.includes(tagId)
        ? filters.tagIds.filter((selectedTagId) => selectedTagId !== tagId)
        : [tagId, ...filters.tagIds];

      nextSearchParams.delete(POST_LIST_FILTER_SEARCH_PARAM_KEYS.tagIds);
      nextTagIds.forEach((selectedTagId) => {
        nextSearchParams.append(POST_LIST_FILTER_SEARCH_PARAM_KEYS.tagIds, selectedTagId);
      });
    });
  };

  return {
    filters,
    setAuthorFilter,
    setCategoryFilter,
    setPeriodFilter,
    setSortFilter,
    toggleTagFilter,
  };
};
