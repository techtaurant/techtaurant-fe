import { act, render, screen, waitFor } from '@testing-library/react';

import { highlightCode } from '@/shared/lib/markdown/highlight-code';
import { renderPostMarkdown } from '@/shared/lib/markdown/render-post-markdown';
import { PostContent } from '@/shared/ui/post-content/post-content';

const mockRender = jest.fn();
const mockInitialize = jest.fn();
let mockResolvedTheme = 'light';

jest.mock('mermaid', () => ({
  __esModule: true,
  default: {
    initialize: (...args: unknown[]) => mockInitialize(...args),
    render: (...args: unknown[]) => mockRender(...args),
  },
}));

jest.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: mockResolvedTheme }),
}));

const renderContent = (source: string) => renderPostMarkdown(source, [], highlightCode).html;
const diagramSource = '```mermaid\nflowchart TD\n A[요청] --> B[응답]\n```';

describe('게시글 본문 확장 렌더링', () => {
  beforeEach(() => {
    mockResolvedTheme = 'light';
    mockRender.mockReset().mockResolvedValue({ svg: '<svg role="img" aria-label="요청 흐름"></svg>' });
    mockInitialize.mockReset();
  });

  it('Mermaid를 다이어그램으로 표시하고 일반 코드는 유지한다', async () => {
    const { container } = render(<PostContent content={renderContent(diagramSource + '\n\n`flowchart TD`')} />);

    expect(await screen.findByRole('img', { name: '요청 흐름' })).toBeInTheDocument();
    expect(container.querySelector('pre code.language-mermaid')).not.toBeInTheDocument();
    expect(container.querySelector('code')).toHaveTextContent('flowchart TD');
    expect(mockRender).toHaveBeenCalledWith(expect.any(String), 'flowchart TD\n A[요청] --> B[응답]\n');
    expect(mockInitialize).toHaveBeenCalledWith(
      expect.objectContaining({ securityLevel: 'strict', startOnLoad: false, suppressErrorRendering: true }),
    );
  });

  it('잘못된 다이어그램은 원문으로 남기고 다음 다이어그램을 표시한다', async () => {
    mockRender.mockRejectedValueOnce(new Error('문법 오류'));
    const { container } = render(
      <PostContent content={renderContent('```mermaid\ninvalid\n```\n\n' + diagramSource)} />,
    );

    expect(await screen.findByRole('img', { name: '요청 흐름' })).toBeInTheDocument();
    expect(container.querySelector('pre code.language-mermaid')).toHaveTextContent('invalid');
    const ids = mockRender.mock.calls.map(([id]) => id);
    expect(new Set(ids).size).toBe(2);
  });

  it('본문이 바뀌면 완료가 늦은 이전 다이어그램을 표시하지 않는다', async () => {
    let finishRender!: (value: { svg: string }) => void;
    mockRender.mockImplementationOnce(() => new Promise((resolve) => (finishRender = resolve)));
    const { rerender, container } = render(<PostContent content={renderContent(diagramSource)} />);
    await waitFor(() => expect(mockRender).toHaveBeenCalledTimes(1));

    rerender(<PostContent content={renderContent('## 새 게시글')} />);
    await act(async () => finishRender({ svg: '<svg role="img" aria-label="이전 글"></svg>' }));

    expect(screen.getByRole('heading', { name: '새 게시글' })).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('해제 후에는 비동기 다이어그램 결과를 적용하지 않는다', async () => {
    let finishRender!: (value: { svg: string }) => void;
    mockRender.mockImplementationOnce(() => new Promise((resolve) => (finishRender = resolve)));
    const { unmount, container } = render(<PostContent content={renderContent(diagramSource)} />);
    await waitFor(() => expect(mockRender).toHaveBeenCalledTimes(1));
    const content = container.querySelector('[data-post-content]')!;

    unmount();
    await act(async () => finishRender({ svg: '<svg role="img"></svg>' }));

    expect(content.querySelector('svg')).toBeNull();
    expect(content.querySelector('pre code')).toHaveTextContent('flowchart TD');
  });

  it('다크 모드로 바꾸면 원문에서 다이어그램을 다시 그린다', async () => {
    const content = renderContent(diagramSource);
    const { rerender } = render(<PostContent content={content} />);
    await screen.findByRole('img', { name: '요청 흐름' });

    mockResolvedTheme = 'dark';
    rerender(<PostContent content={content} />);

    await waitFor(() => expect(mockRender).toHaveBeenCalledTimes(2));
    expect(mockInitialize).toHaveBeenLastCalledWith(expect.objectContaining({ theme: 'dark' }));
    expect(mockRender.mock.calls[1][1]).toBe(mockRender.mock.calls[0][1]);
  });

  it('실제 KaTeX로 인라인·블록 수식을 표시하고 코드 원문과 diff를 보존한다', async () => {
    const source = '$x_1^2$\n\n$$\n\\frac{a}{b}\n$$\n\n`$x$`\n\n```diff\n-old\n+new\n```';
    const { container } = render(<PostContent content={renderContent(source)} />);

    await waitFor(() => expect(container.querySelectorAll('.katex')).toHaveLength(2));
    expect(container.querySelector('.math-inline math')?.isConnected).toBe(true);
    expect(container.querySelector('.math-block .katex-display')).toBeInTheDocument();
    expect(container.querySelector('code')).toHaveTextContent('$x$');
    expect(container.querySelector('.hljs-deletion')).toHaveTextContent('-old');
    expect(container.querySelector('.hljs-addition')).toHaveTextContent('+new');
    expect(mockRender).not.toHaveBeenCalled();
  });

  it('잘못된 수식과 위험 명령으로 본문이 중단되거나 외부 HTML이 생성되지 않는다', async () => {
    const source = String.raw`$\frac{$ $\href{javascript:alert(1)}{click}$ $\includegraphics{https://attacker.example/x}$ $x^2$`;
    const { container } = render(<PostContent content={renderContent(source)} />);

    await waitFor(() => expect(container.querySelector('.katex-error')).toBeInTheDocument());
    expect(container.querySelector('.katex-error')).toHaveTextContent('\\frac{');
    expect(container.querySelectorAll('.katex')).toHaveLength(3);
    expect(container.querySelector('a, img, script, iframe')).not.toBeInTheDocument();
  });
});
