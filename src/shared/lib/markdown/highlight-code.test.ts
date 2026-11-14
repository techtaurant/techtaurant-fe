import hljs from 'highlight.js/lib/core';
import sanitizeHtml from 'sanitize-html';

import { highlightCode } from '@/shared/lib/markdown/highlight-code';

describe('코드 하이라이팅 테스트', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('지원하기로 한 언어가 빠짐없이 등록되어 있다', () => {
    const supportedLanguages = [
      'javascript',
      'sql',
      'html',
      'css',
      'python',
      'bash',
      'shell',
      'typescript',
      'java',
      'csharp',
      'powershell',
      'cpp',
      'c',
      'rust',
      'php',
      'go',
      'kotlin',
      'lua',
      'x86asm',
      'armasm',
      'swift',
      'ruby',
      'markdown',
      'http',
    ];

    expect(supportedLanguages.filter((language) => !hljs.getLanguage(language))).toEqual([]);
  });

  it.each([
    {
      language: 'typescript',
      code: ['const html: string = "<img src=x onerror=alert(1)> & &lt;";', '', '\tconst count = 1; // 한글'].join(
        '\n',
      ),
      expectedKeyword: 'const',
    },
    {
      language: 'ts',
      code: ['const label: string = "hello";', '', '\tconst count = 1;'].join('\n'),
      expectedKeyword: 'const',
    },
    {
      language: 'lua',
      code: ["local current = redis.call('GET', KEYS[1])", '', '\treturn current'].join('\n'),
      expectedKeyword: 'local',
    },
    {
      language: 'kotlin',
      code: [
        'fun findById(id: Long = 1): Mono<PostResponse> {',
        '\tval label = "<PostResponse> &"',
        '',
        '\treturn postRepository.findById(id)',
        '}',
      ].join('\n'),
      expectedKeyword: 'fun',
    },
  ])('$language 코드의 강조와 원문 공백을 보존한다', ({ language, code, expectedKeyword }) => {
    const highlighted = highlightCode(code, language);
    const plainText = sanitizeHtml(highlighted, { allowedTags: [], allowedAttributes: {} });

    expect(highlighted).toContain(`<span class="hljs-keyword">${expectedKeyword}</span>`);
    expect(highlighted).toContain('class="hljs-string"');
    expect(highlighted).toContain('<span class="hljs-number">1</span>');
    expect(plainText).toBe(code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
  });

  it.each(['', 'unknown-language'])('언어가 "%s"이면 강조 결과를 반환하지 않는다', (language) => {
    expect(highlightCode('const count = 1;', language)).toBe('');
  });

  it('강조 엔진이 실패하면 빈 문자열을 반환하고 다음 호출은 정상 처리한다', () => {
    jest.spyOn(hljs, 'highlight').mockImplementationOnce(() => {
      throw new Error('강조 실패');
    });

    expect(highlightCode('const count = 1;', 'ts')).toBe('');
    expect(highlightCode('local count = 1', 'lua')).toContain('<span class="hljs-keyword">local</span>');
  });

  it('diff 추가·삭제·문맥 행을 강조하면서 원문을 보존한다', () => {
    const code = '@@ -1 +1 @@\n-const count = 1;\n+const count = 2;\n unchanged\n';
    const container = document.createElement('div');
    container.innerHTML = highlightCode(code, 'diff');

    expect(container.querySelector('.hljs-deletion')).toHaveTextContent('-const count = 1;');
    expect(container.querySelector('.hljs-addition')).toHaveTextContent('+const count = 2;');
    expect(container.textContent).toBe(code);
  });
});
