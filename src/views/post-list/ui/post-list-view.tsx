'use client';

import { useSearchParams } from 'next/navigation';

import { parsePostListFilters, toPostListApiParams, useGetPostList } from '@/entities/post-list';
import { PostCardList } from '@/widgets/post-card';
import { PostListFilterBar } from '@/widgets/post-list-filter-bar';
import { PostListSidebar } from '@/widgets/post-list-sidebar';

export function PostListView() {
  const searchParams = useSearchParams();
  const filters = parsePostListFilters(searchParams);

  const { isFetching, isFetchingNextPage, data, fetchNextPage, hasNextPage } = useGetPostList({
    params: toPostListApiParams(filters),
  });

  return (
    <div className="mx-auto flex w-full max-w-350 gap-6 px-4 py-6 md:px-6">
      <PostListSidebar />
      <section className="mx-auto w-full max-w-182 min-w-0">
        <PostListFilterBar />
        <PostCardList
          posts={data ?? []}
          hasNextPage={hasNextPage}
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </section>
    </div>
  );
}
