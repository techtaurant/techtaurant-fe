let nextDiagramId = 0;
// SVG에서 원문을 복원할 수 없으므로 노드 수명에 맞춰 원본 코드 블록을 보관한다.
const diagramSources = new WeakMap<HTMLElement, HTMLElement>();

export async function renderPostDiagrams(container: HTMLElement, isDark: boolean, isCancelled: () => boolean) {
  const blocks = container.querySelectorAll<HTMLElement>('pre > code.language-mermaid, .post-mermaid');
  if (!blocks.length) return;

  const { default: mermaid } = await import('mermaid');
  if (isCancelled()) return;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    suppressErrorRendering: true,
    theme: isDark ? 'redux-dark' : 'neutral',
    look: 'classic',
  });

  for (const block of blocks) {
    if (isCancelled()) return;

    const sourceBlock = diagramSources.get(block) ?? block;
    if (!sourceBlock.matches('code.language-mermaid')) continue;
    const originalPre = sourceBlock.parentElement;
    const target = block === sourceBlock ? originalPre : block;
    const id = `post-mermaid-${nextDiagramId++}`;

    try {
      const { svg } = await mermaid.render(id, sourceBlock.textContent ?? '');
      if (isCancelled()) return;

      const diagram = document.createElement('div');
      diagram.className = 'post-mermaid';
      diagram.innerHTML = svg;
      diagramSources.set(diagram, sourceBlock);
      target?.replaceWith(diagram);
    } catch {
      // Mermaid는 실패할 때도 임시 노드를 남길 수 있다. 원문은 유지하고 이 렌더의 노드만 제거한다.
      document.getElementById(`d${id}`)?.remove();
      if (!isCancelled() && originalPre && block !== sourceBlock) block.replaceWith(originalPre);
    }
  }
}
