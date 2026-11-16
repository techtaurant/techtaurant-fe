import type { Metadata } from 'next';

import type { PostListFilters } from '@/entities/post-list';
import { isDefaultPostListFilters } from '@/entities/post-list';

const POST_LIST_CANONICAL_PATH = '/posts';

const FILTERED_POST_LIST_METADATA: Metadata = {
  robots: { index: false, follow: true },
};

export const buildPostListMetadata = (filters: PostListFilters): Metadata => {
  if (!isDefaultPostListFilters(filters)) {
    return FILTERED_POST_LIST_METADATA;
  }

  return { alternates: { canonical: POST_LIST_CANONICAL_PATH } };
};
