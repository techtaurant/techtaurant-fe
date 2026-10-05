'use client';

import { useSearchParams } from 'next/navigation';

import { parsePostListFilters, toPostListApiParams, useGetPostList } from '@/entities/post-list';

type Params = {
  userId: string;
  categoryId?: string;
};

export const useUserPostList = ({ userId, categoryId }: Params) => {
  const filters = parsePostListFilters(useSearchParams());

  return useGetPostList({
    params: { ...toPostListApiParams(filters), authorId: userId, categoryId },
  });
};
