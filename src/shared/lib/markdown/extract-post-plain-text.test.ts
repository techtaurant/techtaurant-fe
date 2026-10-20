import { extractPostPlainText } from '@/shared/lib/markdown/extract-post-plain-text';
import type * as MarkdownRendererModule from '@/shared/lib/markdown/render-post-markdown';
import { renderPostMarkdown } from '@/shared/lib/markdown/render-post-markdown';

jest.mock('@/shared/lib/markdown/render-post-markdown', () => {
  const actual = jest.requireActual<typeof MarkdownRendererModule>('@/shared/lib/markdown/render-post-markdown');

  return {
    ...actual,
    renderPostMarkdown: jest.fn(actual.renderPostMarkdown),
  };
});

const mockedRenderPostMarkdown = jest.mocked(renderPostMarkdown);

describe('게시물 목록과 임시저장 목록의 본문 요약', () => {
  beforeEach(() => {
    mockedRenderPostMarkdown.mockClear();
  });

  it('강조 함수를 주입하지 않고 코드가 포함된 본문을 텍스트로 추출한다', () => {
    const source = [
      '코드 예시',
      '',
      '```typescript',
      'const count: number = 1;',
      '```',
      '',
      '```lua',
      "local current = redis.call('GET', KEYS[1])",
      '```',
    ].join('\n');

    expect(extractPostPlainText(source)).toBe(
      "코드 예시 const count: number = 1; local current = redis.call('GET', KEYS[1])",
    );
    expect(mockedRenderPostMarkdown).toHaveBeenCalledTimes(1);
    expect(mockedRenderPostMarkdown).toHaveBeenCalledWith(source, []);
  });

  it('인라인 서식과 조사 사이는 붙이고 문단과 코드 블록 사이는 구분한다', () => {
    const source = [
      '**자동저장**은 `draft`를 저장합니다.',
      '',
      '```ts',
      'const count = 1;',
      '```',
      '',
      '다음 문단',
    ].join('\n');

    expect(extractPostPlainText(source)).toBe('자동저장은 draft를 저장합니다. const count = 1; 다음 문단');
  });

  it('본문에 이미 강조 span이 있어도 텍스트를 누락하거나 토큰 사이에 공백을 추가하지 않는다', () => {
    const source = [
      '<details>',
      '<summary>요약</summary>',
      '<p><strong>자동저장</strong>은 ',
      '<code>',
      '<span class="hljs-title">count</span>',
      '<span class="hljs-operator">++</span>',
      '</code>를 보존합니다.</p>',
      '</details>',
    ].join('');

    expect(extractPostPlainText(source)).toBe('요약 자동저장은 count++를 보존합니다.');
    expect(mockedRenderPostMarkdown).toHaveBeenCalledWith(source, []);
  });
});
