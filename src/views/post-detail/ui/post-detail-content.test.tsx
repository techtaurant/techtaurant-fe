import { render, screen } from '@testing-library/react';

import type { PostDetailAttachmentPresignedUrlResponse } from '@/shared/api/generated';
import type * as MarkdownRendererModule from '@/shared/lib/markdown/render-post-markdown';
import { renderPostMarkdown } from '@/shared/lib/markdown/render-post-markdown';
import { PostDetailContent } from '@/views/post-detail/ui/post-detail-content';

jest.mock('@/shared/lib/markdown/render-post-markdown', () => {
  const actual = jest.requireActual<typeof MarkdownRendererModule>('@/shared/lib/markdown/render-post-markdown');

  return {
    ...actual,
    renderPostMarkdown: jest.fn(actual.renderPostMarkdown),
  };
});

const rendererModule = jest.requireActual<typeof MarkdownRendererModule>('@/shared/lib/markdown/render-post-markdown');
const mockedRenderPostMarkdown = jest.mocked(renderPostMarkdown);

const ATTACHMENT_ID = '11111111-1111-4111-8111-111111111111';
const PRESIGNED_URL = 'https://storage.example.com/posts/first.png?signature=first';

const attachmentPresignedUrls: PostDetailAttachmentPresignedUrlResponse[] = [
  { attachmentId: ATTACHMENT_ID, presignedUrl: PRESIGNED_URL },
];

const markdownContent = `
## HTTP 메시지

> **중요**: 본문은 안전하게 렌더링됩니다.

[공식 문서](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)

| 항목 | 값 |
| --- | --- |
| 상태 | 정상 |

- 첫 번째 항목
- 두 번째 항목

\`\`\`js
const content = '<span>코드 안 HTML</span>';
\`\`\`
`;

const xssMixedContent = `
## 안전한 제목

<details open onclick="alert(1)"><summary>안전한 상세</summary><span class="badge">안전한 내용</span></details>

<script>alert(1)</script>
<img src="https://example.com/safe.png" alt="안전한 이미지" onerror="alert(1)">
<svg><g onload="alert(1)"></g></svg>
<iframe src="https://attacker.example"></iframe>
<a href="javascript:alert(1)">위험 링크</a>
[마크다운 위험 링크](JaVaScRiPt:alert(1))

\`<img src=x onerror=alert(1)>\`

\`\`\`html
<script>alert(1)</script>
<img src=x onerror=alert(1)>
\`\`\`
`;

describe('게시물 상세 본문', () => {
  beforeEach(() => {
    mockedRenderPostMarkdown.mockReset();
    mockedRenderPostMarkdown.mockImplementation(rendererModule.renderPostMarkdown);
  });

  it('본문 원문을 마크다운 렌더러에 전달하고 반환 HTML을 렌더링한다', () => {
    mockedRenderPostMarkdown.mockReturnValue('<h2>렌더러 결과</h2><p>정제된 본문</p>');

    render(<PostDetailContent attachmentPresignedUrls={attachmentPresignedUrls} content="원문" />);

    expect(mockedRenderPostMarkdown).toHaveBeenCalledWith('원문', attachmentPresignedUrls);
    expect(screen.getByRole('heading', { level: 2, name: '렌더러 결과' })).toBeInTheDocument();
    expect(screen.getByText('정제된 본문')).toBeInTheDocument();
  });

  it('실제 렌더러로 제목·인용문·링크·표·목록·코드 블록을 화면에 표시한다', () => {
    const { container } = render(<PostDetailContent attachmentPresignedUrls={[]} content={markdownContent} />);

    expect(screen.getByRole('heading', { level: 2, name: 'HTTP 메시지' })).toBeInTheDocument();
    expect(container.querySelector('blockquote')).toHaveTextContent('본문은 안전하게 렌더링됩니다.');
    expect(
      screen.getByRole('link', {
        name: '공식 문서',
      }),
    ).toHaveAttribute('href', 'https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop');
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(container.querySelector('pre code.language-js')).toHaveTextContent('<span>코드 안 HTML</span>');
    expect(container.querySelector('pre code span')).not.toBeInTheDocument();
    expect(container.querySelector('section')).toHaveClass('whitespace-pre-wrap');
  });

  it('실제 렌더러로 본문 첨부 이미지를 presigned URL로 표시한다', () => {
    render(
      <PostDetailContent
        attachmentPresignedUrls={attachmentPresignedUrls}
        content={`![첨부 이미지](${ATTACHMENT_ID})`}
      />,
    );

    expect(screen.getByAltText('첨부 이미지')).toHaveAttribute('src', PRESIGNED_URL);
  });

  it('실제 렌더러로 XSS payload가 섞인 본문을 안전한 DOM으로만 렌더링한다', () => {
    const { container } = render(<PostDetailContent attachmentPresignedUrls={[]} content={xssMixedContent} />);

    expect(screen.getByRole('heading', { level: 2, name: '안전한 제목' })).toBeInTheDocument();
    expect(screen.getByText('안전한 상세')).toBeInTheDocument();
    expect(screen.getByText('안전한 내용')).toHaveClass('badge');
    expect(screen.getByAltText('안전한 이미지')).toHaveAttribute('src', 'https://example.com/safe.png');
    expect(
      container.querySelectorAll(
        'script, svg, iframe, [onclick], [onerror], [onload], [href*="javascript" i], [src*="javascript" i]',
      ),
    ).toHaveLength(0);
    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeInTheDocument();
    expect(container.querySelector('pre script, pre img, code img')).not.toBeInTheDocument();
  });
});
