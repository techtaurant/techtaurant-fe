import hljs from 'highlight.js/lib/core';

import { highlightCode } from '@/shared/lib/markdown/highlight-code';
import { renderPostMarkdown } from '@/shared/lib/markdown/render-post-markdown';

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

  it('강조 엔진이 실패한 블록은 안전한 원문으로 표시하고 다음 블록은 계속 강조한다', () => {
    jest.spyOn(hljs, 'highlight').mockImplementationOnce(() => {
      throw new Error('강조 실패');
    });
    const source = 'const html = "<img src=x onerror=alert(1)>";\n';
    const container = document.createElement('div');

    container.innerHTML = renderPostMarkdown(
      `\`\`\`ts\n${source}\`\`\`\n\n\`\`\`lua\nlocal count = 1\n\`\`\``,
      [],
      highlightCode,
    );
    const [fallbackCode, highlightedCode] = container.querySelectorAll('pre code');

    expect(fallbackCode.textContent).toBe(source);
    expect(fallbackCode.children).toHaveLength(0);
    expect(highlightedCode.querySelector('.hljs-keyword')).toHaveTextContent('local');
    expect(highlightedCode.textContent).toBe('local count = 1\n');
  });
});
