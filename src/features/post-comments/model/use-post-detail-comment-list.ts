'use client';

import { useState } from 'react';

import type { CommentSort } from '@/entities/comment';
import { COMMENT_SORT, useGetParentComments } from '@/entities/comment';

type Params = {
  postId: string;
};

export const usePostDetailCommentList = ({ postId }: Params) => {
  const [commentsSort, setCommentsSort] = useState<CommentSort>(COMMENT_SORT.LATEST);

  const parentCommentsQuery = useGetParentComments({
    postId,
    sort: commentsSort,
  });

  const handleLoadMoreComments = async () => {
    if (!parentCommentsQuery.hasNextPage || parentCommentsQuery.isFetchingNextPage) return;

    await parentCommentsQuery.fetchNextPage();
  };

  const handleCommentsSortChange = (sort: CommentSort) => {
    setCommentsSort(sort);
  };

  return {
    comments: parentCommentsQuery.data ?? [],
    commentsHasNext: !!parentCommentsQuery.hasNextPage,
    commentsSort,
    handleCommentsSortChange,
    handleLoadMoreComments,
    isCommentsLoading: parentCommentsQuery.isPending || parentCommentsQuery.isPlaceholderData,
    isCommentsLoadingMore: parentCommentsQuery.isFetchingNextPage,
  };
};
