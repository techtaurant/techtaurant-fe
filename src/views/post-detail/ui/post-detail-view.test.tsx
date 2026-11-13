import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { useGetPostDetail } from '@/entities/post-detail';
import type { CategoryResponse, PostDetailResponse } from '@/shared/api/generated';
import { PostDetailView } from '@/views/post-detail/ui/post-detail-view';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock('@/entities/post-detail', () => ({ useGetPostDetail: jest.fn() }));
jest.mock('@/entities/user', () => ({ useGetMe: () => ({}), UserAvatar: () => null }));
jest.mock('@/features/auth', () => ({ startGoogleLogin: jest.fn() }));
jest.mock('@/features/user-follow', () => ({ useUserFollow: () => ({}) }));
jest.mock('@/features/user-block', () => ({ useOpenUserBlockConfirmModal: () => jest.fn() }));
jest.mock('@/features/post-comments', () => ({ PostDetailCommentsSection: () => null }));
jest.mock('@/features/post-detail-interactions', () => ({
  PostDetailActionBar: () => null,
  PostDetailOwnerMenu: () => null,
}));
jest.mock('@/views/post-detail/model/use-record-post-view-once', () => ({ useRecordPostViewOnce: jest.fn() }));
jest.mock('@/views/post-detail/ui/post-detail-header-actions', () => ({ PostDetailHeaderActions: () => null }));
jest.mock('@/views/post-detail/ui/post-detail-toc', () => ({ PostDetailToc: () => null }));

const category: CategoryResponse = {
  id: '15c6fb01-b0b6-4b75-b303-125456789abc',
  name: 'macos',
  path: '개발 환경/운영체제/macos',
  depth: 3,
  postCount: 1,
};
const post: PostDetailResponse = {
  id: 'post-id',
  author: { id: 'author-id', name: '작성자', profileImageUrl: '' },
  category,
  title: 'macOS 설정',
  content: '본문',
  status: 'PUBLISHED',
  tags: [],
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  likeStatus: 'NONE',
  isRead: false,
  attachmentPresignedUrls: [],
  createdAt: '2026-11-13T00:00:00Z',
  updatedAt: '2026-11-13T00:00:00Z',
};

const renderPost = (postCategory?: CategoryResponse) => {
  jest
    .mocked(useGetPostDetail)
    .mockReturnValue({ data: { ...post, category: postCategory } } as ReturnType<typeof useGetPostDetail>);

  return render(
    <QueryClientProvider client={new QueryClient()}>
      <PostDetailView postId={post.id} />
    </QueryClientProvider>,
  );
};

describe('게시물 상세 카테고리 이동', () => {
  it('중첩 카테고리의 전체 경로를 작성자의 해당 카테고리 링크로 표시한다', () => {
    renderPost(category);

    expect(screen.getByRole('link', { name: category.path })).toHaveAttribute(
      'href',
      `/users/${post.author.id}?categoryId=${category.id}`,
    );
    expect(screen.queryByText(category.name, { exact: true })).not.toBeInTheDocument();
  });

  it('최상위 카테고리도 작성자의 해당 카테고리로 연결한다', () => {
    renderPost({ ...category, path: 'macos', depth: 1 });

    expect(screen.getByRole('link', { name: 'macos' })).toHaveAttribute(
      'href',
      `/users/${post.author.id}?categoryId=${category.id}`,
    );
  });

  it('카테고리가 없는 게시물은 카테고리 배지를 표시하지 않는다', () => {
    renderPost();

    expect(screen.getByRole('heading', { name: post.title })).toBeInTheDocument();
    expect(screen.queryByText(category.path)).not.toBeInTheDocument();
    expect(screen.getAllByRole('link').every((link) => !link.getAttribute('href')?.includes('categoryId'))).toBe(true);
  });
});
