import type { Metadata } from 'next';

import type { PostListFilters } from '@/entities/post-list';
import { isDefaultPostListFilters } from '@/entities/post-list';
import type { UserProfileImageResponse } from '@/shared/api/generated';

const HIDDEN_USER_METADATA: Metadata = {
  title: '사용자',
  robots: { index: false, follow: false },
};

export const buildUserDetailMetadata = (
  profile: UserProfileImageResponse | undefined,
  filters: PostListFilters,
): Metadata => {
  if (!profile) {
    return HIDDEN_USER_METADATA;
  }

  const title = `${profile.authorName}의 글`;

  if (!isDefaultPostListFilters(filters)) {
    return { title, robots: { index: false, follow: true } };
  }

  return { title, alternates: { canonical: `/users/${profile.userId}` } };
};
