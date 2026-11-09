import type { ResolvedMetadata } from 'next';

import type { PostDetailResponse } from '@/shared/api/generated';
import { DEFAULT_SHARE_IMAGE_URL } from '@/shared/config';
import { buildPostDetailMetadata } from '@/views/post-detail/lib/build-post-detail-metadata';

const PARENT_OPEN_GRAPH: ResolvedMetadata['openGraph'] = {
  type: 'website',
  title: { absolute: '테크토랑', template: null },
  siteName: '테크토랑',
  locale: 'ko_KR',
  images: [{ url: DEFAULT_SHARE_IMAGE_URL }],
  url: null,
};

const createPost = (overrides: Partial<PostDetailResponse> = {}): PostDetailResponse => ({
  id: 'post-id',
  title: '공개 글 제목',
  content: '# 제목\n\n첫 문장입니다. 두 번째 문장입니다.',
  author: { id: 'author-id', name: '작성자', profileImageUrl: '' },
  tags: [],
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  likeStatus: 'NONE',
  status: 'PUBLISHED',
  isRead: false,
  attachmentPresignedUrls: [],
  createdAt: '2026-11-05T00:00:00Z',
  updatedAt: '2026-11-05T00:00:00Z',
  ...overrides,
});

describe('buildPostDetailMetadata', () => {
  it('공개 글은 본문 요약과 article OG를 내고 부모 siteName을 유지하며 robots는 지정하지 않는다', () => {
    const metadata = buildPostDetailMetadata(createPost(), PARENT_OPEN_GRAPH);

    expect(metadata.description).toBe('제목 첫 문장입니다. 두 번째 문장입니다.');
    expect(metadata.openGraph).toMatchObject({ type: 'article', siteName: '테크토랑' });
    expect(metadata.robots).toBeUndefined();
  });

  it('썸네일로 지정한 첨부가 있으면 그 URL을 OG 이미지로 쓴다', () => {
    const post = createPost({
      thumbnailAttachmentId: 'thumb',
      attachmentPresignedUrls: [
        { attachmentId: 'first', presignedUrl: 'https://cdn.example/first.png' },
        { attachmentId: 'thumb', presignedUrl: 'https://cdn.example/thumb.png' },
      ],
    });

    const metadata = buildPostDetailMetadata(post, PARENT_OPEN_GRAPH);

    expect(metadata.openGraph?.images).toEqual(['https://cdn.example/thumb.png']);
  });

  it('썸네일 지정이 없으면 첫 첨부를 OG 이미지로 쓴다', () => {
    const post = createPost({
      attachmentPresignedUrls: [
        { attachmentId: 'first', presignedUrl: 'https://cdn.example/first.png' },
        { attachmentId: 'second', presignedUrl: 'https://cdn.example/second.png' },
      ],
    });

    const metadata = buildPostDetailMetadata(post, PARENT_OPEN_GRAPH);

    expect(metadata.openGraph?.images).toEqual(['https://cdn.example/first.png']);
  });

  it('첨부가 없으면 기본 공유 이미지를 쓴다', () => {
    const metadata = buildPostDetailMetadata(createPost(), PARENT_OPEN_GRAPH);

    expect(metadata.openGraph?.images).toEqual([DEFAULT_SHARE_IMAGE_URL]);
  });

  it.each([
    ['공개 상태가 아닌', createPost({ status: 'PRIVATE' })],
    ['조회 실패', undefined],
  ])('%s 글은 일반 제목과 noindex만 내고 글 내용을 담지 않는다', (_, post) => {
    const metadata = buildPostDetailMetadata(post, PARENT_OPEN_GRAPH);

    expect(metadata).toEqual({ title: '게시물', robots: { index: false, follow: false } });
  });
});
