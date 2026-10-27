export const preparePostHeadings = (body: HTMLElement, postId: string) => {
  return Array.from(body.querySelectorAll<HTMLElement>('h2, h3'), (element, index) => {
    const id = `post-${postId}-heading-${index + 1}`;
    const title = element.textContent?.replace(/\s+/g, ' ').trim() || '제목 없음';
    const level = element.tagName === 'H2' ? 2 : 3;

    element.id = id;
    element.tabIndex = -1;
    element.classList.add('scroll-mt-24');

    return { id, title, level };
  });
};
