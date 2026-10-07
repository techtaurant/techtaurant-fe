'use client';

import { useUserPostList } from '@/views/user-detail/model/use-user-post-list';
import { PostCardList } from '@/widgets/post-card';

type Props = {
  userId: string;
  categoryId?: string;
};

export function UserPostList({ userId, categoryId }: Props) {
  const {
    data: posts = [],
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
  } = useUserPostList({
    userId,
    categoryId,
  });

  return (
    <PostCardList
      posts={posts}
      hasNextPage={hasNextPage}
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
