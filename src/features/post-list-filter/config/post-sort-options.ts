import type { PostListSortFilter } from '@/entities/post-list';
import { GetPostsApiSort } from '@/shared/api/generated';

export const POST_SORT_OPTIONS = [
  { label: '최신순', value: GetPostsApiSort.LATEST },
  { label: '조회순', value: GetPostsApiSort.VIEW },
  { label: '추천순', value: GetPostsApiSort.LIKE },
  { label: '댓글순', value: GetPostsApiSort.COMMENT },
] satisfies { label: string; value: PostListSortFilter }[];
