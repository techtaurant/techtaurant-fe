import type { PostListPeriodFilter } from '@/entities/post-list';
import { GetPostsApiPeriod } from '@/shared/api/generated';

export const POST_PERIOD_OPTIONS = [
  { label: '7일', value: GetPostsApiPeriod.WEEK },
  { label: '30일', value: GetPostsApiPeriod.MONTH },
  { label: '365일', value: GetPostsApiPeriod.YEAR },
  { label: '전체', value: GetPostsApiPeriod.ALL },
] satisfies { label: string; value: PostListPeriodFilter }[];
