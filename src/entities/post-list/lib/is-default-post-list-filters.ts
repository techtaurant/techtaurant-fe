import type { PostListFilters } from '@/entities/post-list/model/post-list-filters';
import { GetPostsApiPeriod, GetPostsApiSort } from '@/shared/api/generated';

export const isDefaultPostListFilters = ({ authorId, period, sort, tagIds }: PostListFilters) => {
  return !authorId && tagIds.length === 0 && period === GetPostsApiPeriod.ALL && sort === GetPostsApiSort.LATEST;
};
