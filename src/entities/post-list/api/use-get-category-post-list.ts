import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getPostListQueryKey } from '@/entities/post-list/api/use-get-post-list';
import type { PostListApiParams } from '@/entities/post-list/model/post-list-filters';
import type { PostListItemResponse } from '@/shared/api/generated';
import { getPostsApi } from '@/shared/api/generated';

type Params = {
  params: Omit<PostListApiParams, 'categoryId'>;
  categoryIds: string[];
  enabled: boolean;
};

const fetchCategoryPosts = async (params: PostListApiParams, signal: AbortSignal) => {
  const posts: PostListItemResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await getPostsApi({ ...params, size: 100, cursor }, { signal });
    posts.push(...(response.data?.content ?? []));
    cursor = response.data?.nextCursor;
  } while (cursor);

  return posts;
};

const getSortValue = (post: PostListItemResponse, sort: PostListApiParams['sort']) => {
  switch (sort) {
    case 'VIEW':
      return post.viewCount;
    case 'LIKE':
      return post.likeCount;
    case 'COMMENT':
      return post.commentCount;
    case 'UPDATED':
      return Date.parse(post.updatedAt);
    default:
      return Date.parse(post.createdAt);
  }
};

export const useGetCategoryPostList = ({ params, categoryIds, enabled }: Params) => {
  return useQuery({
    // 기존 게시물 변경 시 이 목록도 함께 무효화됩니다.
    queryKey: [...getPostListQueryKey(params), 'categories', categoryIds],
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      // API는 카테고리 하나만 지원하므로 각 목록을 모두 조회한 뒤 전체 정렬합니다.
      const groups = await Promise.all(
        categoryIds.map((categoryId) => fetchCategoryPosts({ ...params, categoryId }, signal)),
      );
      const posts = [...new Map(groups.flat().map((post) => [post.id, post])).values()];

      return posts.sort((left, right) => {
        return (
          getSortValue(right, params.sort) - getSortValue(left, params.sort) ||
          Date.parse(right.createdAt) - Date.parse(left.createdAt) ||
          right.id.localeCompare(left.id)
        );
      });
    },
  });
};
