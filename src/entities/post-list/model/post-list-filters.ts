import type { GetPostsApiParams } from '@/shared/api/generated';
import { GetPostsApiPeriod, GetPostsApiSort } from '@/shared/api/generated';

export const POST_LIST_FILTER_SEARCH_PARAM_KEYS = {
  authorId: 'authorId',
  period: 'period',
  sort: 'sort',
  tagIds: 'tagIds',
} as const;

export type PostListPeriodFilter = (typeof GetPostsApiPeriod)[keyof typeof GetPostsApiPeriod];
export type PostListSortFilter = (typeof GetPostsApiSort)[keyof typeof GetPostsApiSort];

export type PostListFilters = {
  authorId?: string;
  period: PostListPeriodFilter;
  sort: PostListSortFilter;
  tagIds: string[];
};

export type PostListApiParams = Omit<GetPostsApiParams, 'cursor'>;

export const POST_LIST_PERIOD_VALUES = new Set<PostListPeriodFilter>(Object.values(GetPostsApiPeriod));
export const POST_LIST_SORT_VALUES = new Set<PostListSortFilter>(Object.values(GetPostsApiSort));
