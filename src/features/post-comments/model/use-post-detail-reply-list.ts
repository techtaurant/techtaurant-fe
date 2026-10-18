'use client';

import type { CommentSort } from '@/entities/comment';
import { useGetReplies } from '@/entities/comment';

type Params = {
  commentsSort: CommentSort;
  parentCommentId: string;
};

export const usePostDetailReplyList = ({ commentsSort, parentCommentId }: Params) => {
  const repliesQuery = useGetReplies({
    commentId: parentCommentId,
    sort: commentsSort,
  });

  const handleLoadMoreReplies = () => {
    if (!repliesQuery.hasNextPage || repliesQuery.isFetchingNextPage) return;

    void repliesQuery.fetchNextPage();
  };

  return {
    handleLoadMoreReplies,
    isRepliesError: repliesQuery.isError,
    isRepliesLoading: repliesQuery.isPending,
    isRepliesLoadingMore: repliesQuery.isFetchingNextPage,
    replies: repliesQuery.data ?? [],
    repliesHasNext: !!repliesQuery.hasNextPage,
  };
};
