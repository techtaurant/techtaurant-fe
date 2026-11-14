import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import type { CommentItem } from '@/entities/comment';
import { getMeQueryKey } from '@/entities/user';
import { PostDetailCommentItem } from '@/features/post-comments/ui/post-detail-comment-item';

const mockRenderDiagram = jest.fn();

jest.mock('mermaid', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    render: (...args: unknown[]) => mockRenderDiagram(...args),
  },
}));

const comment: CommentItem = {
  id: 'comment-1',
  postId: 'post-1',
  authorId: 'author-1',
  authorName: '댓글 작성자',
  content: '',
  depth: 0,
  likeCount: 0,
  replyCount: 0,
  likeStatus: 'NONE',
  isDeleted: false,
  isBanned: false,
  createdAt: '2026-11-14T00:00:00Z',
  updatedAt: '2026-11-14T00:00:00Z',
};
const diagramSource = '```mermaid\nflowchart TD\n A --> B\n```';

const renderComment = (overrides: Partial<CommentItem>, variant: 'compact' | 'default' = 'default') => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { enabled: false, retry: false } } });
  queryClient.setQueryData(getMeQueryKey(), { data: { id: comment.authorId } });
  return render(
    <QueryClientProvider client={queryClient}>
      <PostDetailCommentItem
        comment={{ ...comment, ...overrides }}
        variant={variant}
        postAuthorId="post-author"
        onRequireLogin={jest.fn()}
      />
    </QueryClientProvider>,
  );
};

describe('댓글과 답글 문법 렌더링', () => {
  beforeEach(() => {
    mockRenderDiagram.mockReset().mockResolvedValue({ svg: '<svg role="img" aria-label="댓글 흐름"></svg>' });
  });

  it.each(['default', 'compact'] as const)(
    '%s 댓글에서 게시물과 같은 Markdown·수식·diff를 표시한다',
    async (variant) => {
      const { container } = renderComment(
        {
          depth: variant === 'compact' ? 1 : 0,
          content:
            '# 제목\n\n**강조**\n다음 줄\n\n- 목록\n\n[링크](https://example.com)\n\n| 열 |\n| --- |\n| 값 |\n\n$x_1^2$\n\n$$\n\\frac{a}{b}\n$$\n\n`$x$`\n\n```diff\n-old\n+new\n```',
        },
        variant,
      );

      expect(screen.getByRole('heading', { name: '제목' })).toBeInTheDocument();
      expect(container.querySelector('strong')).toHaveTextContent('강조');
      expect(container.querySelector('p br')).toBeInTheDocument();
      expect(screen.getByRole('listitem')).toHaveTextContent('목록');
      expect(screen.getByRole('link', { name: '링크' })).toHaveAttribute('href', 'https://example.com');
      expect(screen.getByRole('table')).toHaveTextContent('값');
      await waitFor(() => expect(container.querySelectorAll('.katex')).toHaveLength(2));
      expect(container.querySelector('.math-block .katex-display')).toBeInTheDocument();
      expect(container.querySelector('code')).toHaveTextContent('$x$');
      expect(container.querySelector('.hljs-deletion')).toHaveTextContent('-old');
      expect(container.querySelector('.hljs-addition')).toHaveTextContent('+new');
    },
  );

  it('여러 댓글의 Mermaid를 서로 다른 다이어그램으로 표시한다', async () => {
    renderComment({ content: diagramSource });
    renderComment({ id: 'reply-1', parentId: comment.id, depth: 1, content: diagramSource }, 'compact');

    await waitFor(() => expect(screen.getAllByRole('img', { name: '댓글 흐름' })).toHaveLength(2));
    expect(new Set(mockRenderDiagram.mock.calls.map(([id]) => id)).size).toBe(2);
  });

  it('잘못된 Mermaid는 원문을 남기고 정상 수식은 표시한다', async () => {
    mockRenderDiagram.mockRejectedValueOnce(new Error('문법 오류'));
    const { container } = renderComment({ content: '```mermaid\ninvalid\n```\n\n$x^2$' });

    await waitFor(() => expect(container.querySelector('.katex')).toBeInTheDocument());
    expect(container.querySelector('pre code.language-mermaid')).toHaveTextContent('invalid');
    expect(container.querySelector('.post-mermaid')).not.toBeInTheDocument();
  });

  it('댓글의 위험한 HTML·URL·수식 명령을 실행 가능한 내용으로 표시하지 않는다', async () => {
    const { container } = renderComment({
      content:
        '<script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">위험 링크</a>\n\n$\\href{javascript:alert(1)}{click}$ $x^2$',
    });

    await waitFor(() => expect(container.querySelectorAll('.katex')).toHaveLength(2));
    expect(container.querySelector('script, iframe, [onerror], a[href^="javascript:"]')).not.toBeInTheDocument();
  });

  it.each([
    [true, false, '삭제된 댓글입니다.'],
    [false, true, '차단한 사용자의 댓글입니다.'],
    [true, true, '삭제된 댓글입니다.'],
  ])('삭제=%s 차단=%s 상태에서는 원문 대신 안내만 표시한다', async (isDeleted, isBanned, message) => {
    const { container } = renderComment({ isDeleted, isBanned, content: diagramSource + '\n\n$secret$' });

    expect(screen.getByText(message)).toBeInTheDocument();
    expect(container).not.toHaveTextContent('secret');
    expect(container.querySelector('code, .math-inline, .post-mermaid')).not.toBeInTheDocument();
    expect(mockRenderDiagram).not.toHaveBeenCalled();
  });

  it('수정 창에는 원문을 표시하고 취소하면 다이어그램을 다시 표시한다', async () => {
    renderComment({ content: diagramSource });
    await screen.findByRole('img', { name: '댓글 흐름' });

    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.click(screen.getByText('수정'));
    expect(screen.getByRole('textbox')).toHaveValue(diagramSource);
    expect(screen.queryByRole('img', { name: '댓글 흐름' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '취소' }));
    await screen.findByRole('img', { name: '댓글 흐름' });
  });

  it('빈 댓글은 본문이나 확장 문법을 생성하지 않는다', () => {
    const { container } = renderComment({ content: '' });

    expect(container.querySelector('[data-post-content]')).toBeEmptyDOMElement();
    expect(mockRenderDiagram).not.toHaveBeenCalled();
  });
});
