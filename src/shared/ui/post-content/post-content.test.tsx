import { render, screen } from '@testing-library/react';

import type { PostDetailAttachmentPresignedUrlResponse } from '@/shared/api/generated';
import type * as MarkdownRendererModule from '@/shared/lib/markdown/render-post-markdown';
import { renderPostMarkdown } from '@/shared/lib/markdown/render-post-markdown';
import { PostContent } from '@/shared/ui/post-content/post-content';

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

const typescriptCodeWithSpecialCharacters = `const html: string = "<img src=x onerror=alert(1)> & &lt;";

\tconst count = 1; // 한글`;

describe('게시물 본문', () => {
  beforeEach(() => {
    mockedRenderPostMarkdown.mockReset();
    mockedRenderPostMarkdown.mockImplementation(rendererModule.renderPostMarkdown);
  });

  it('본문 원문과 코드 강조 함수를 마크다운 렌더러에 전달하고 반환 HTML을 렌더링한다', () => {
    mockedRenderPostMarkdown.mockReturnValue('<h2>렌더러 결과</h2><p>정제된 본문</p>');

    render(<PostContent attachmentPresignedUrls={attachmentPresignedUrls} content="원문" />);

    expect(mockedRenderPostMarkdown).toHaveBeenCalledWith('원문', attachmentPresignedUrls, expect.any(Function));
    expect(screen.getByRole('heading', { level: 2, name: '렌더러 결과' })).toBeInTheDocument();
    expect(screen.getByText('정제된 본문')).toBeInTheDocument();
  });

  it('실제 렌더러로 제목·인용문·링크·표·목록·코드 블록을 화면에 표시한다', () => {
    const { container } = render(<PostContent attachmentPresignedUrls={[]} content={markdownContent} />);

    expect(screen.getByRole('heading', { level: 2, name: 'HTTP 메시지' })).toBeInTheDocument();
    expect(container.querySelector('blockquote')).toHaveTextContent('본문은 안전하게 렌더링됩니다.');
    expect(
      screen.getByRole('link', {
        name: '공식 문서',
      }),
    ).toHaveAttribute('href', 'https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop');
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(container.querySelector('pre code.language-js')?.textContent).toBe(
      "const content = '<span>코드 안 HTML</span>';\n",
    );
    expect(container.querySelector('pre code.language-js .hljs-keyword')).toHaveTextContent('const');
    expect(container.firstElementChild).toHaveClass('postContent');
    expect(container.firstElementChild).not.toHaveClass('whitespace-pre-wrap');
  });

  it.each([
    {
      language: 'typescript',
      code: typescriptCodeWithSpecialCharacters,
      expectedKeyword: 'const',
      expectedString: '"<img src=x onerror=alert(1)> & &lt;"',
    },
    {
      language: 'ts',
      code: ['const label: string = "hello";', '', '\tconst count = 1;'].join('\n'),
      expectedKeyword: 'const',
      expectedString: '"hello"',
    },
    {
      language: 'lua',
      code: ["local current = redis.call('GET', KEYS[1])", '', '\treturn current'].join('\n'),
      expectedKeyword: 'local',
      expectedString: "'GET'",
    },
  ])(
    '$language 코드의 키워드·문자열·숫자를 강조하고 공백과 특수문자를 보존한다',
    ({ language, code, expectedKeyword, expectedString }) => {
      const { container } = render(
        <PostContent attachmentPresignedUrls={[]} content={`\`\`\`${language}\n${code}\n\`\`\``} />,
      );
      const codeElement = container.querySelector(`pre code.language-${language}`);

      expect(codeElement?.querySelector('.hljs-keyword')).toHaveTextContent(expectedKeyword);
      expect(codeElement?.querySelector('.hljs-string')?.textContent).toBe(expectedString);
      expect(codeElement?.querySelector('.hljs-number')).toHaveTextContent('1');
      expect(codeElement?.textContent).toBe(`${code}\n`);
      expect(codeElement?.querySelector('img, script')).not.toBeInTheDocument();
    },
  );

  it.each(['', 'unknown-language', 'text', 'plaintext'])(
    '언어가 "%s"인 코드 블록은 자동 추측 없이 안전한 원문으로 표시한다',
    (language) => {
      const code = 'const html = "<img src=x onerror=alert(1)>";\n';
      const { container } = render(
        <PostContent attachmentPresignedUrls={[]} content={`\`\`\`${language}\n${code}\`\`\``} />,
      );
      const codeElement = container.querySelector('pre code');

      expect(codeElement?.textContent).toBe(code);
      expect(codeElement?.children).toHaveLength(0);
    },
  );

  it('미리보기 본문과 언어가 바뀌면 강조 결과를 갱신하고 빈 본문에서는 이전 코드를 제거한다', () => {
    const { container, rerender } = render(
      <PostContent attachmentPresignedUrls={[]} content={'```ts\nconst count = 1;\n```'} />,
    );

    expect(container.querySelector('pre code.language-ts .hljs-keyword')).toHaveTextContent('const');

    rerender(<PostContent attachmentPresignedUrls={[]} content={'```lua\nlocal count = 2\n```'} />);

    expect(container.querySelectorAll('pre code')).toHaveLength(1);
    expect(container.querySelector('pre code.language-ts')).not.toBeInTheDocument();
    expect(container.querySelector('pre code.language-lua .hljs-keyword')).toHaveTextContent('local');
    expect(container.querySelector('pre code')?.textContent).toBe('local count = 2\n');

    rerender(<PostContent attachmentPresignedUrls={[]} content="" />);

    expect(container.firstElementChild).toBeEmptyDOMElement();
  });

  it('실제 렌더러로 본문 첨부 이미지를 presigned URL로 표시한다', () => {
    render(
      <PostContent attachmentPresignedUrls={attachmentPresignedUrls} content={`![첨부 이미지](${ATTACHMENT_ID})`} />,
    );

    expect(screen.getByAltText('첨부 이미지')).toHaveAttribute('src', PRESIGNED_URL);
  });

  it('실제 렌더러로 XSS payload가 섞인 본문을 안전한 DOM으로만 렌더링한다', () => {
    const { container } = render(<PostContent attachmentPresignedUrls={[]} content={xssMixedContent} />);

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
    expect(container.querySelector('pre code.language-html')?.textContent).toBe(
      '<script>alert(1)</script>\n<img src=x onerror=alert(1)>\n',
    );
    expect(container.querySelector('pre code.language-html .hljs-tag')).toBeInTheDocument();
    expect(container.querySelector('pre script, pre img, code img')).not.toBeInTheDocument();
  });
});
