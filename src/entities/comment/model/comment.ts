import type { CommentListResponse } from '@/shared/api/generated';
import { CommentListResponseLikeStatus, GetParentCommentsApiSort } from '@/shared/api/generated';

export const COMMENT_SORT = GetParentCommentsApiSort;
export const COMMENT_LIKE_STATUS = CommentListResponseLikeStatus;

export type CommentSort = (typeof COMMENT_SORT)[keyof typeof COMMENT_SORT];
export type CommentLikeStatus = (typeof COMMENT_LIKE_STATUS)[keyof typeof COMMENT_LIKE_STATUS];

export type CommentItem = CommentListResponse;
