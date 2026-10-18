import { keepPreviousData } from '@tanstack/react-query';

import { getCommentsQueryKey } from '@/entities/comment/api/use-get-parent-comments';
import { DEFAULT_COMMENT_LIST_SIZE } from '@/entities/comment/config/constants';
import type { CommentSort } from '@/entities/comment/model/comment';
import { COMMENT_SORT } from '@/entities/comment/model/comment';
import type { GetRepliesApiParams } from '@/shared/api/generated';
import { useGetRepliesApiInfinite } from '@/shared/api/generated';

type Params = {
  commentId: string;
  sort?: CommentSort;
};

const toRepliesParams = (sort?: CommentSort) => {
  return {
    size: DEFAULT_COMMENT_LIST_SIZE,
    sort: sort ?? COMMENT_SORT.LATEST,
  } satisfies GetRepliesApiParams;
};

export const getCommentRepliesQueryKey = (commentId: string) => {
  return [...getCommentsQueryKey(), 'replies', commentId] as const;
};

const getRepliesQueryKey = ({ commentId, sort }: Pick<Params, 'commentId' | 'sort'>) => {
  return [
    ...getCommentRepliesQueryKey(commentId),
    { size: DEFAULT_COMMENT_LIST_SIZE, sort: sort ?? COMMENT_SORT.LATEST },
  ] as const;
};

export const useGetReplies = ({ commentId, sort }: Params) => {
  const params = toRepliesParams(sort);

  return useGetRepliesApiInfinite(commentId, params, {
    query: {
      getNextPageParam: (lastPage) => lastPage.data?.nextCursor ?? undefined,
      initialPageParam: undefined as string | undefined,
      placeholderData: keepPreviousData,
      queryKey: getRepliesQueryKey({ commentId, sort }),
      select: (data) => data.pages.flatMap((page) => page.data?.content ?? []),
    },
  });
};
