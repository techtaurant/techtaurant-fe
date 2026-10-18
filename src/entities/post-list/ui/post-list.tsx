import type { ReactNode } from 'react';

import type { PostListItemResponse } from '@/shared/api/generated';

type Props = {
  isRefreshing: boolean;
  posts: PostListItemResponse[];
  renderEmpty: () => ReactNode;
  renderPosts: (posts: PostListItemResponse[], state: { isRefreshing: boolean }) => ReactNode;
};

export function PostList({ isRefreshing, posts, renderEmpty, renderPosts }: Props) {
  if (posts.length > 0) {
    return renderPosts(posts, { isRefreshing });
  }

  if (isRefreshing) return null;

  return renderEmpty();
}
