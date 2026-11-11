import { isDefaultPostListFilters } from '@/entities/post-list/lib/is-default-post-list-filters';
import type { PostListFilters } from '@/entities/post-list/model/post-list-filters';

const DEFAULT_FILTERS: PostListFilters = { period: 'ALL', sort: 'LATEST', tagIds: [] };

describe('isDefaultPostListFilters', () => {
  it('기본값 필터면 true를 돌려준다', () => {
    expect(isDefaultPostListFilters(DEFAULT_FILTERS)).toBe(true);
  });

  it.each<[string, Partial<PostListFilters>]>([
    ['authorId', { authorId: 'u1' }],
    ['tagIds', { tagIds: ['t1'] }],
    ['period', { period: 'WEEK' }],
    ['sort', { sort: 'VIEW' }],
  ])('%s가 기본값과 다르면 false를 돌려준다', (_, overrides) => {
    expect(isDefaultPostListFilters({ ...DEFAULT_FILTERS, ...overrides })).toBe(false);
  });
});
