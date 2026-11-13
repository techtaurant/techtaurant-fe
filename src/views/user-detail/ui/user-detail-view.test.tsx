import { fireEvent, render, screen } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';

import { UserDetailView } from '@/views/user-detail/ui/user-detail-view';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/users/author-id',
  useSearchParams: jest.fn(),
  notFound: jest.fn(),
}));
jest.mock('@/entities/user', () => ({
  useGetUserProfileImage: () => ({ data: { name: '작성자' }, isPending: false, isError: false }),
}));
jest.mock('@/entities/category', () => ({
  ...jest.requireActual('@/entities/category'),
  useSearchCategories: () => ({
    data: [
      { id: 'macos-id', name: 'macos', path: 'macos', depth: 1, postCount: 1 },
      { id: 'linux-id', name: 'linux', path: 'linux', depth: 1, postCount: 2 },
    ],
  }),
}));
jest.mock('@/views/user-detail/ui/user-profile-header', () => ({ UserProfileHeader: () => null }));
jest.mock('@/widgets/header', () => ({ Header: () => null }));
jest.mock('@/features/post-list-filter', () => ({
  ...jest.requireActual('@/features/post-list-filter'),
  PostPeriodFilter: () => null,
  PostSortFilter: () => null,
}));
jest.mock('@/views/user-detail/ui/user-category-sidebar', () => ({ UserCategorySidebar: () => null }));
jest.mock('@/views/user-detail/ui/user-post-list', () => ({
  UserPostList: ({ userId, categoryId }: { userId: string; categoryId?: string }) => (
    <div aria-label="게시물 필터">{`${userId}:${categoryId ?? 'all'}`}</div>
  ),
}));

const setSearchParams = (query: string) => {
  jest.mocked(useSearchParams).mockReturnValue(new URLSearchParams(query) as ReturnType<typeof useSearchParams>);
};

describe('사용자 카테고리 URL 선택', () => {
  beforeEach(() => {
    mockPush.mockClear();
    setSearchParams('');
  });

  it('URL의 카테고리를 선택하고 작성자와 카테고리를 게시물 목록에 전달한다', () => {
    setSearchParams('categoryId=macos-id');
    render(<UserDetailView userId="author-id" />);

    expect(screen.getByRole('button', { name: 'macos 1' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('게시물 필터')).toHaveTextContent('author-id:macos-id');
  });

  it('카테고리가 없는 URL에서는 전체 글을 선택한다', () => {
    render(<UserDetailView userId="author-id" />);

    expect(screen.getByRole('button', { name: '전체 글' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('게시물 필터')).toHaveTextContent('author-id:all');
  });

  it('뒤로 가기 등으로 URL이 변경되면 선택한 카테고리를 갱신한다', () => {
    setSearchParams('categoryId=macos-id');
    const { rerender } = render(<UserDetailView userId="author-id" />);

    setSearchParams('categoryId=linux-id');
    rerender(<UserDetailView userId="author-id" />);

    expect(screen.getByRole('button', { name: 'linux 2' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'macos 1' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByLabelText('게시물 필터')).toHaveTextContent('author-id:linux-id');
  });

  it('카테고리 변경 시 기간과 정렬 등 기존 URL 필터를 유지한다', () => {
    setSearchParams('categoryId=macos-id&period=MONTH&sort=VIEW');
    render(<UserDetailView userId="author-id" />);

    fireEvent.click(screen.getByRole('button', { name: 'linux 2' }));

    expect(mockPush).toHaveBeenCalledWith('/users/author-id?categoryId=linux-id&period=MONTH&sort=VIEW');
  });

  it.each(['categoryId=macos-id&period=MONTH', 'categoryId=macos-id'])(
    '전체 글 선택 시 categoryId만 제거한다 (%s)',
    (query) => {
      setSearchParams(query);
      render(<UserDetailView userId="author-id" />);

      fireEvent.click(screen.getByRole('button', { name: '전체 글' }));

      expect(mockPush).toHaveBeenCalledWith(
        query.includes('period') ? '/users/author-id?period=MONTH' : '/users/author-id',
      );
    },
  );
});
