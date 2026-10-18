import { keepPreviousData } from '@tanstack/react-query';

import { DEFAULT_COMMENT_LIST_SIZE } from '@/entities/comment/config/constants';
import type { CommentSort } from '@/entities/comment/model/comment';
import { COMMENT_SORT } from '@/entities/comment/model/comment';
import type { GetParentCommentsApiParams } from '@/shared/api/generated';
import { useGetParentCommentsApiInfinite } from '@/shared/api/generated';

type Params = {
  postId: string;
  sort?: CommentSort;
};

const toParentCommentsParams = (sort?: CommentSort) => {
  return {
    size: DEFAULT_COMMENT_LIST_SIZE,
    sort: sort ?? COMMENT_SORT.LATEST,
  } satisfies GetParentCommentsApiParams;
};

export const getCommentsQueryKey = () => {
  return ['comments'] as const;
};

export const getPostCommentsQueryKey = (postId: string) => {
  return [...getCommentsQueryKey(), 'parents', postId] as const;
};

const getParentCommentsQueryKey = ({ postId, sort }: Pick<Params, 'postId' | 'sort'>) => {
  return [
    ...getPostCommentsQueryKey(postId),
    { size: DEFAULT_COMMENT_LIST_SIZE, sort: sort ?? COMMENT_SORT.LATEST },
  ] as const;
};

export const useGetParentComments = ({ postId, sort }: Params) => {
  const params = toParentCommentsParams(sort);

  return useGetParentCommentsApiInfinite(postId, params, {
    query: {
      getNextPageParam: (lastPage) => lastPage.data?.nextCursor ?? undefined,
      initialPageParam: undefined as string | undefined,
      placeholderData: keepPreviousData,
      queryKey: getParentCommentsQueryKey({ postId, sort }),
      select: (data) => data.pages.flatMap((page) => page.data?.content ?? []),
    },
  });
};
