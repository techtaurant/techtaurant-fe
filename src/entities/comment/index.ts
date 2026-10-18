export { useCreateComment } from '@/entities/comment/api/use-create-comment';
export { useDeleteComment } from '@/entities/comment/api/use-delete-comment';
export {
  getCommentsQueryKey,
  getPostCommentsQueryKey,
  useGetParentComments,
} from '@/entities/comment/api/use-get-parent-comments';
export { getCommentRepliesQueryKey, useGetReplies } from '@/entities/comment/api/use-get-replies';
export { useUpdateComment } from '@/entities/comment/api/use-update-comment';
export { useUpdateCommentLikeStatus } from '@/entities/comment/api/use-update-comment-like-status';
export type { CommentItem, CommentLikeStatus, CommentSort } from '@/entities/comment/model/comment';
export { COMMENT_LIKE_STATUS, COMMENT_SORT } from '@/entities/comment/model/comment';
