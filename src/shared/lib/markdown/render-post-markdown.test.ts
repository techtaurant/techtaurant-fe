import type { Options } from 'markdown-it';

import type { PostDetailAttachmentPresignedUrlResponse } from '@/shared/api/generated';
import { extractPostPlainText } from '@/shared/lib/markdown/extract-post-plain-text';
import { renderPostMarkdown } from '@/shared/lib/markdown/render-post-markdown';

function renderHtml(
  markdown: string,
  attachmentPresignedUrls: PostDetailAttachmentPresignedUrlResponse[] = [],
  highlight?: Options['highlight'],
) {
  const container = document.createElement('div');
  container.innerHTML = renderPostMarkdown(markdown, attachmentPresignedUrls, highlight);
  document.body.append(container);

  return container;
}

function hasCodeBlock(container: HTMLElement, language: string, text: string) {
  return Array.from(container.querySelectorAll(`pre code.language-${language}`)).some((code) =>
    code.textContent?.includes(text),
  );
}

const mixedXssContent = `
# 안전한 제목

정상 **강조**와 [안전한 링크](https://techtaurant.com/ko)가 함께 있어야 합니다.

<details open onclick="alert('details')"><summary>안전한 상세</summary><span class="badge" style="color:red">내용</span></details>

| 안전한 표 |
| --- |
| 값 |

<script>alert('script')</script>
<img src="https://example.com/safe.png" alt="안전한 이미지" onerror="alert('image')">
<svg><g onload="alert('svg')"></g></svg>
<math><mi//xlink:href="data:x,<script>alert('math')</script>"></math>
<iframe src="https://attacker.example"></iframe>
<object data="javascript:alert('object')"></object>
<form action="https://attacker.example"><input name="password"><button formaction="https://attacker.example">전송</button></form>
<base href="https://attacker.example"><meta http-equiv="refresh" content="0;url=https://attacker.example">
<a href="javascript:alert('raw-link')">위험 링크</a>
<a href="&#x6a;avascript:alert('encoded-link')">인코딩 링크</a>
<img src="data:text/html,<script>alert('data-uri')</script>" alt="위험 이미지">

[마크다운 위험 링크](JaVaScRiPt:alert('markdown-link'))

\`<img src=x onerror=alert('inline-code')>\`

\`\`\`html
<img src=x onerror=alert('code-block')>
<script>alert('code-block')</script>
\`\`\`
`;

const markdownRenderingContent = `
# HTTP 메시지의 흐름

> **핵심**: \`await\`는 이벤트 루프를 멈추지 않습니다.

[Node.js 공식 문서](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)

![구조도](/images/node-event-loop.png)

| 실행 계층 | 처리 대상 |
| --- | --- |
| microtask | Promise reaction |
| timers | setTimeout callback |

1. 요청을 받습니다.
2. 비동기 작업을 예약합니다.

- \`process.nextTick()\`을 확인합니다.
- Promise queue를 비웁니다.

<details open><summary>추가 설명</summary><span class="badge">안전한 raw HTML</span></details>

\`\`\`http
GET /posts HTTP/1.1
Host: api.techtaurant.com
\`\`\`

\`\`\`js
process.nextTick(() => console.log('next tick'));
\`\`\`

\`\`\`java
@GetMapping("/posts")
public List<Post> posts() { return List.of(); }
\`\`\`

\`\`\`mermaid
flowchart TD
  A[Request] --> B[Response<br/>HTML literal]
\`\`\`

\`\`\`bash
pnpm test
\`\`\`
`;

const FIRST_ATTACHMENT_ID = '11111111-1111-4111-8111-111111111111';
const SECOND_ATTACHMENT_ID = '22222222-2222-4222-8222-222222222222';
const UNMAPPED_ATTACHMENT_ID = '33333333-3333-4333-8333-333333333333';
const FIRST_PRESIGNED_URL = 'https://storage.example.com/posts/first.png?signature=first';
const SECOND_PRESIGNED_URL = 'https://storage.example.com/posts/second.png?signature=second';

const attachmentPresignedUrls: PostDetailAttachmentPresignedUrlResponse[] = [
  { attachmentId: FIRST_ATTACHMENT_ID, presignedUrl: FIRST_PRESIGNED_URL },
  { attachmentId: SECOND_ATTACHMENT_ID, presignedUrl: SECOND_PRESIGNED_URL },
];

const attachmentImageContent = `
![본문 이미지](${FIRST_ATTACHMENT_ID})

- ![목록 안 이미지](${SECOND_ATTACHMENT_ID})
`;

const unmappedAttachmentImageContent = `![삭제된 이미지](${UNMAPPED_ATTACHMENT_ID})`;

const attachmentIdInCodeContent = `
\`![인라인 코드 이미지](${FIRST_ATTACHMENT_ID})\`

\`\`\`md
![코드 블록 이미지](${FIRST_ATTACHMENT_ID})
\`\`\`
`;

describe('게시물 마크다운 렌더러', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  describe('코드 강조 함수 주입', () => {
    const code = 'const count = 1;\n';
    const source = `\`\`\`typescript\n${code}\`\`\``;
    const highlightedCode = '<span class="hljs-keyword">const</span> count = 1;\n';

    it('강조 함수를 생략하면 언어가 있어도 원문 코드만 렌더링한다', () => {
      const container = renderHtml(source);
      const codeElement = container.querySelector('pre code.language-typescript');

      expect(codeElement?.textContent).toBe(code);
      expect(codeElement?.children).toHaveLength(0);
    });

    it('주입한 함수에 코드와 언어를 전달하고 반환된 강조 토큰을 유지한다', () => {
      const highlight = jest.fn().mockReturnValue(highlightedCode);
      const container = renderHtml(source, [], highlight);

      expect(highlight).toHaveBeenCalledTimes(1);
      expect(highlight).toHaveBeenCalledWith(code, 'typescript', '');
      expect(container.querySelector('pre code.language-typescript .hljs-keyword')).toHaveTextContent('const');
      expect(container.querySelector('pre code')?.textContent).toBe(code);
    });

    it('강조 함수가 반환한 HTML도 정제하되 정상적인 강조 토큰은 유지한다', () => {
      const unsafeHighlightedCode = [
        '<span class="hljs-keyword" onclick="alert(1)" style="color:red">const</span> count = 1;',
        '<script>alert(1)</script>',
      ].join('\n');
      const highlight = jest.fn().mockReturnValue(unsafeHighlightedCode);
      const container = renderHtml(source, [], highlight);

      expect(container.querySelector('pre code .hljs-keyword')).toHaveTextContent('const');
      expect(container.querySelectorAll('script, [onclick], [style]')).toHaveLength(0);
      expect(container.querySelector('pre code')?.textContent).toBe(code);
    });

    it('강조 함수가 빈 문자열을 반환하면 원문을 HTML로 실행하지 않고 표시한다', () => {
      const htmlCode = '<img src=x onerror=alert(1)>\n';
      const highlight = jest.fn().mockReturnValue('');
      const container = renderHtml(`\`\`\`unknown\n${htmlCode}\`\`\``, [], highlight);

      expect(highlight).toHaveBeenCalledWith(htmlCode, 'unknown', '');
      expect(container.querySelector('pre code')?.textContent).toBe(htmlCode);
      expect(container.querySelector('pre code')?.children).toHaveLength(0);
    });

    it('여러 언어와 강조하지 않는 블록이 섞여도 각 코드의 순서와 원문을 보존한다', () => {
      const javascriptCode = 'const count = 1;\n';
      const unknownCode = '<img src=x onerror=alert(1)>\n';
      const luaCode = "local current = redis.call('GET', KEYS[1])\n";
      const highlight = jest
        .fn()
        .mockReturnValueOnce('<span class="hljs-keyword">const</span> count = 1;\n')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(`<span class="hljs-keyword">local</span> current = redis.call('GET', KEYS[1])\n`);
      const mixedSource = [
        `\`\`\`js\n${javascriptCode}\`\`\``,
        `\`\`\`unknown\n${unknownCode}\`\`\``,
        `\`\`\`lua\n${luaCode}\`\`\``,
      ].join('\n\n');
      const container = renderHtml(mixedSource, [], highlight);
      const blocks = container.querySelectorAll('pre code');

      expect(highlight).toHaveBeenCalledTimes(3);
      expect(highlight).toHaveBeenNthCalledWith(1, javascriptCode, 'js', '');
      expect(highlight).toHaveBeenNthCalledWith(2, unknownCode, 'unknown', '');
      expect(highlight).toHaveBeenNthCalledWith(3, luaCode, 'lua', '');
      expect(Array.from(blocks, (block) => block.textContent)).toEqual([javascriptCode, unknownCode, luaCode]);
      expect(blocks[0].querySelector('.hljs-keyword')).toHaveTextContent('const');
      expect(blocks[1].children).toHaveLength(0);
      expect(blocks[2].querySelector('.hljs-keyword')).toHaveTextContent('local');
    });

    it('강조를 적용하면서 참조 링크와 첨부 이미지를 처리하고 코드 안의 첨부 ID는 보존한다', () => {
      const attachmentCode = `const attachment = "${FIRST_ATTACHMENT_ID}";\n`;
      const highlight = jest
        .fn()
        .mockReturnValue(`<span class="hljs-keyword">const</span> attachment = "${FIRST_ATTACHMENT_ID}";\n`);
      const sourceWithAttachment = [
        '[문서][docs]',
        '',
        `![본문 이미지](${FIRST_ATTACHMENT_ID})`,
        '',
        `\`\`\`ts\n${attachmentCode}\`\`\``,
        '',
        '[docs]: https://example.com/docs',
      ].join('\n');
      const container = renderHtml(sourceWithAttachment, attachmentPresignedUrls, highlight);

      expect(container.querySelector('a[href="https://example.com/docs"]')).toHaveTextContent('문서');
      expect(container.querySelector('img')).toHaveAttribute('src', FIRST_PRESIGNED_URL);
      expect(container.querySelector('pre code .hljs-keyword')).toHaveTextContent('const');
      expect(container.querySelector('pre code')?.textContent).toBe(attachmentCode);
      expect(highlight).toHaveBeenCalledWith(attachmentCode, 'ts', '');
    });

    it('강조 함수를 주입해도 인라인 코드에는 호출하지 않는다', () => {
      const highlight = jest.fn().mockReturnValue(highlightedCode);
      const container = renderHtml('`const count = 1;`', [], highlight);

      expect(highlight).not.toHaveBeenCalled();
      expect(container.querySelector('code')?.textContent).toBe('const count = 1;');
      expect(container.querySelector('code')?.children).toHaveLength(0);
    });

    it('주입한 강조 함수는 다음 일반 렌더링과 목록 요약에 영향을 주지 않는다', () => {
      const highlight = jest.fn().mockReturnValue(highlightedCode);
      const highlighted = renderHtml(source, [], highlight);
      const plain = renderHtml(source);
      const summary = extractPostPlainText(source);

      expect(highlighted.querySelector('pre code .hljs-keyword')).toHaveTextContent('const');
      expect(plain.querySelector('pre code')?.textContent).toBe(code);
      expect(plain.querySelector('pre code')?.children).toHaveLength(0);
      expect(summary).toBe('const count = 1;');
      expect(highlight).toHaveBeenCalledTimes(1);
    });
  });

  describe('XSS 방지', () => {
    it('다양한 XSS payload가 섞인 본문에서 안전한 서식만 남긴다', () => {
      const container = renderHtml(mixedXssContent);

      expect(container.querySelector('h1')).toHaveTextContent('안전한 제목');
      expect(container.querySelector('strong')).toHaveTextContent('강조');
      expect(container.querySelector('a[href="https://techtaurant.com/ko"]')).toHaveTextContent('안전한 링크');
      expect(container.querySelector('details')).toHaveAttribute('open');
      expect(container.querySelector('summary')).toHaveTextContent('안전한 상세');
      expect(container.querySelector('span')).toHaveClass('badge');
      expect(container.querySelector('table')).toBeInTheDocument();
      expect(container.querySelector('img[src="https://example.com/safe.png"]')).toHaveAttribute(
        'alt',
        '안전한 이미지',
      );

      expect(
        container.querySelectorAll(
          'script, svg, math, iframe, object, embed, form, input, button, base, meta, [onerror], [onload], [onclick], [style], [xlink\\:href]',
        ),
      ).toHaveLength(0);
      expect(
        container.querySelectorAll('[href*="javascript" i], [src*="javascript" i], [src^="data:" i]'),
      ).toHaveLength(0);
      expect(container.querySelector('code')).toHaveTextContent("<img src=x onerror=alert('inline-code')>");
      expect(container.querySelector('pre code')).toHaveTextContent("<script>alert('code-block')</script>");
      expect(container.querySelector('pre img, pre script, code img')).not.toBeInTheDocument();
    });
  });

  describe('실데이터 렌더링', () => {
    it('다양한 마크다운 서식을 HTML로 변환한다', () => {
      const container = renderHtml(markdownRenderingContent);

      expect(container.querySelector('h1')).toHaveTextContent('HTTP 메시지의 흐름');
      expect(container.querySelector('blockquote')).toHaveTextContent('await는 이벤트 루프를 멈추지 않습니다.');
      expect(
        container.querySelector('a[href="https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop"]'),
      ).toHaveTextContent('Node.js 공식 문서');
      expect(container.querySelector('img[src="/images/node-event-loop.png"]')).toHaveAttribute('alt', '구조도');
      expect(container.querySelectorAll('ul, ol')).toHaveLength(2);
      expect(container.querySelector('table')).toBeInTheDocument();
      expect(container.querySelector('table th')).toHaveTextContent('실행 계층');

      expect(container.querySelector('details')).toHaveAttribute('open');
      expect(container.querySelector('summary')).toHaveTextContent('추가 설명');
      expect(container.querySelector('span')).toHaveClass('badge');
      expect(hasCodeBlock(container, 'http', 'GET /posts HTTP/1.1')).toBe(true);
      expect(hasCodeBlock(container, 'js', 'process.nextTick')).toBe(true);
      expect(hasCodeBlock(container, 'java', '@GetMapping')).toBe(true);
      expect(hasCodeBlock(container, 'mermaid', 'flowchart TD')).toBe(true);
      expect(hasCodeBlock(container, 'bash', 'pnpm test')).toBe(true);
      expect(hasCodeBlock(container, 'mermaid', '<br/>')).toBe(true);
      expect(container.querySelector('pre code.language-mermaid br')).not.toBeInTheDocument();
    });

    it('엔터 한 번(소프트 줄바꿈)을 <br>로 바꿔 작성한 줄 그대로 보여준다', () => {
      const container = renderHtml('첫 줄\n둘째 줄');

      expect(container.querySelector('p br')).toBeInTheDocument();
      expect(container.querySelector('p')).toHaveTextContent('첫 줄 둘째 줄');
    });
  });

  describe('첨부 이미지', () => {
    it('본문의 attachmentId를 presigned URL로 치환하고 alt를 유지한다', () => {
      const container = renderHtml(attachmentImageContent, attachmentPresignedUrls);

      expect(container.querySelector(`img[src="${FIRST_PRESIGNED_URL}"]`)).toHaveAttribute('alt', '본문 이미지');
      expect(container.querySelector(`li img[src="${SECOND_PRESIGNED_URL}"]`)).toHaveAttribute('alt', '목록 안 이미지');
    });

    it('매핑에 없는 attachmentId는 src를 남기지 않는다', () => {
      const container = renderHtml(unmappedAttachmentImageContent, attachmentPresignedUrls);

      expect(container.querySelector('img')).toHaveAttribute('alt', '삭제된 이미지');
      expect(container.querySelector('img')).not.toHaveAttribute('src');
    });

    it('코드 블록과 인라인 코드 안의 attachmentId는 치환하지 않는다', () => {
      const container = renderHtml(attachmentIdInCodeContent, attachmentPresignedUrls);

      expect(container.querySelector('code')).toHaveTextContent(FIRST_ATTACHMENT_ID);
      expect(container.querySelector('pre code')).toHaveTextContent(FIRST_ATTACHMENT_ID);
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('치환한 URL도 sanitize 대상이므로 허용되지 않은 스킴은 제거한다', () => {
      const container = renderHtml(`![위험 이미지](${FIRST_ATTACHMENT_ID})`, [
        { attachmentId: FIRST_ATTACHMENT_ID, presignedUrl: "javascript:alert('attachment')" },
      ]);

      expect(container.querySelector('img')).not.toHaveAttribute('src');
    });
  });
});
