const MAX_MATH_SIZE_EM = 20;

export async function renderPostMath(container: HTMLElement, isCancelled: () => boolean) {
  const formulas = container.querySelectorAll<HTMLElement>('.math-inline, .math-block');
  if (!formulas.length) return;

  const { default: katex } = await import('katex');
  if (isCancelled()) return;

  for (const formula of formulas) {
    if (formula.closest('pre, code')) continue;

    katex.render(formula.textContent ?? '', formula, {
      displayMode: formula.classList.contains('math-block'),
      throwOnError: false,
      trust: false,
      maxSize: MAX_MATH_SIZE_EM,
    });
  }
}
