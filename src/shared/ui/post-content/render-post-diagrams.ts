let nextDiagramId = 0;

export async function renderPostDiagrams(container: HTMLElement, isDark: boolean, isCancelled: () => boolean) {
  const blocks = container.querySelectorAll<HTMLElement>('pre > code.language-mermaid');
  if (!blocks.length) return;

  const { default: mermaid } = await import('mermaid');
  if (isCancelled()) return;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    suppressErrorRendering: true,
    theme: isDark ? 'redux-dark' : 'neutral',
  });

  for (const block of blocks) {
    if (isCancelled()) return;

    const id = `post-mermaid-${nextDiagramId++}`;

    try {
      const { svg } = await mermaid.render(id, block.textContent ?? '');
      if (isCancelled()) return;

      const diagram = document.createElement('div');
      diagram.className = 'post-mermaid';
      diagram.innerHTML = svg;
      block.parentElement?.replaceWith(diagram);
    } catch {
      // Mermaid는 실패할 때도 임시 노드를 남길 수 있다. 원문은 유지하고 이 렌더의 노드만 제거한다.
      document.getElementById(`d${id}`)?.remove();
    }
  }
}
