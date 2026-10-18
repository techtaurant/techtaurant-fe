import type { CreatePostRequestStatus } from '@/shared/api/generated';

export type PostVisibility = typeof CreatePostRequestStatus.PUBLISHED | typeof CreatePostRequestStatus.PRIVATE;
