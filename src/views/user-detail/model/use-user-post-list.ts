'use client';

import { useSearchParams } from 'next/navigation';

import { useSearchCategories } from '@/entities/category';
import {
  parsePostListFilters,
  toPostListApiParams,
  useGetCategoryPostList,
  useGetPostList,
} from '@/entities/post-list';

type Params = {
  userId: string;
  categoryId?: string;
};

export const useUserPostList = ({ userId, categoryId }: Params) => {
  const filters = parsePostListFilters(useSearchParams());
  const { data: categories = [] } = useSearchCategories({ userId, path: '' });
  const selectedCategory = categories.find((category) => category.id === categoryId);
  const categoryIds = selectedCategory
    ? categories
        .filter(({ path }) => path === selectedCategory.path || path.startsWith(`${selectedCategory.path}/`))
        .map(({ id }) => id)
    : [];
  const hasDescendants = categoryIds.length > 1;
  const params = { ...toPostListApiParams(filters), authorId: userId };

  const postList = useGetPostList({
    params: { ...params, categoryId },
    enabled: !hasDescendants,
  });
  const categoryPostList = useGetCategoryPostList({ params, categoryIds, enabled: hasDescendants });
  const query = hasDescendants ? categoryPostList : postList;

  return {
    data: query.data,
    isFetching: query.isFetching,
    hasNextPage: !hasDescendants && postList.hasNextPage,
    isFetchingNextPage: !hasDescendants && postList.isFetchingNextPage,
    fetchNextPage: postList.fetchNextPage,
  };
};
