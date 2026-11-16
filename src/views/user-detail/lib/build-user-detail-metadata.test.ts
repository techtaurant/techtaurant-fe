import type { PostListFilters } from '@/entities/post-list';
import type { UserProfileImageResponse } from '@/shared/api/generated';
import { buildUserDetailMetadata } from '@/views/user-detail/lib/build-user-detail-metadata';

const DEFAULT_FILTERS: PostListFilters = { period: 'ALL', sort: 'LATEST', tagIds: [] };
const PROFILE: UserProfileImageResponse = { userId: 'abc', authorName: '홍길동', profileImageUrl: '' };

describe('buildUserDetailMetadata', () => {
  it('프로필이 없으면 일반 제목과 noindex, nofollow만 낸다', () => {
    expect(buildUserDetailMetadata(undefined, DEFAULT_FILTERS)).toEqual({
      title: '사용자',
      robots: { index: false, follow: false },
    });
  });

  it('정렬·기간·태그를 바꾼 URL이면 작성자 제목을 유지하고 noindex, follow를 내며 canonical은 두지 않는다', () => {
    expect(buildUserDetailMetadata(PROFILE, { ...DEFAULT_FILTERS, sort: 'VIEW' })).toEqual({
      title: '홍길동의 글',
      robots: { index: false, follow: true },
    });
  });

  it('정렬·기간·태그를 바꾸지 않은 기본 URL이면 작성자 제목과 canonical을 내고 robots는 루트를 상속한다', () => {
    expect(buildUserDetailMetadata(PROFILE, DEFAULT_FILTERS)).toEqual({
      title: '홍길동의 글',
      alternates: { canonical: '/users/abc' },
    });
  });
});
