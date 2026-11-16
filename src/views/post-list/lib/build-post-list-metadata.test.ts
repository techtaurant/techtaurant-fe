import type { PostListFilters } from '@/entities/post-list';
import { buildPostListMetadata } from '@/views/post-list/lib/build-post-list-metadata';

const DEFAULT_FILTERS: PostListFilters = { period: 'ALL', sort: 'LATEST', tagIds: [] };

describe('buildPostListMetadata', () => {
  it('기본 필터면 canonical만 내고 robots는 루트를 상속한다', () => {
    expect(buildPostListMetadata(DEFAULT_FILTERS)).toEqual({ alternates: { canonical: '/posts' } });
  });

  it('변형 필터면 noindex, follow만 내고 canonical은 두지 않는다', () => {
    expect(buildPostListMetadata({ ...DEFAULT_FILTERS, sort: 'VIEW' })).toEqual({
      robots: { index: false, follow: true },
    });
  });
});
