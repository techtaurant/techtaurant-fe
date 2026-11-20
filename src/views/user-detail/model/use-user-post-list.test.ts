import { renderHook } from '@testing-library/react';

import { useUserPostList } from '@/views/user-detail/model/use-user-post-list';

const mockUseSearchCategories = jest.fn();
const mockUseGetPostList = jest.fn();

jest.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams() }));
jest.mock('@/entities/category', () => ({ useSearchCategories: () => mockUseSearchCategories() }));
jest.mock('@/entities/post-list', () => ({
  ...jest.requireActual('@/entities/post-list'),
  useGetPostList: (args: unknown) => mockUseGetPostList(args),
  useGetCategoryPostList: () => ({ data: [], isFetching: false }),
}));

describe('사용자 게시물 목록 조회', () => {
  beforeEach(() => {
    mockUseGetPostList.mockReset().mockReturnValue({ data: [], isFetching: false });
  });

  it('카테고리 목록을 불러오기 전에는 선택한 카테고리 목록을 조회하지 않고 갱신 중으로 표시한다', () => {
    mockUseSearchCategories.mockReturnValue({ data: undefined, isPending: true });

    const { result } = renderHook(() => useUserPostList({ userId: 'author-id', categoryId: 'macos-id' }));

    expect(mockUseGetPostList).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
    expect(result.current.isFetching).toBe(true);
  });

  it('카테고리 선택이 없으면 카테고리 목록을 기다리지 않는다', () => {
    mockUseSearchCategories.mockReturnValue({ data: undefined, isPending: true });

    renderHook(() => useUserPostList({ userId: 'author-id' }));

    expect(mockUseGetPostList).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
  });
});
