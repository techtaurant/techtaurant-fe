'use client';

import { PostList } from '@/entities/post-list';
import type { PostListItemResponse } from '@/shared/api/generated';
import { cn } from '@/shared/lib/cn';
import { Observer } from '@/shared/ui/intersection-observer';
import { PostCard } from '@/widgets/post-card/ui/post-card';

type Props = {
  posts: PostListItemResponse[];
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export function PostCardList({ posts, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage }: Props) {
  const isRefreshing = isFetching && !isFetchingNextPage;

  const handleObserverEnter = () => {
    if (!hasNextPage || isFetching) return;
    fetchNextPage();
  };

  return (
    <PostList
      posts={posts}
      isRefreshing={isRefreshing}
      renderPosts={(items, { isRefreshing }) => (
        <>
          <div className={cn('transition-opacity', isRefreshing && 'opacity-60')}>
            {items.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          {hasNextPage && <Observer onEnter={handleObserverEnter} />}
        </>
      )}
      renderEmpty={() => (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground text-lg">조건에 맞는 게시물이 없습니다.</p>
        </div>
      )}
    />
  );
}
