import { preparePostHeadings } from '@/views/post-detail/lib/prepare-post-headings';

describe('상세 본문 목차 대상', () => {
  it('실제 h2/h3만 고르고 중복·한국어·빈 제목에도 고유한 ID를 준다', () => {
    const body = document.createElement('div');
    body.innerHTML = '<h1>제외</h1><h2>한국어 <em>제목</em></h2><h3>한국어 제목</h3><h2> </h2><h4>제외</h4>';

    const headings = preparePostHeadings(body, 'post-one');

    expect(headings.map(({ title }) => title)).toEqual(['한국어 제목', '한국어 제목', '제목 없음']);
    expect(headings.map(({ level }) => level)).toEqual([2, 3, 2]);
    expect(new Set(headings.map(({ id }) => id)).size).toBe(3);
    for (const heading of headings) {
      const target = body.querySelector(`[id="${heading.id}"]`);
      expect(target).toHaveAttribute('tabindex', '-1');
      expect(target).toHaveClass('scroll-mt-24');
    }
  });

  it('반복 준비에도 ID를 유지하고 게시물별로 분리한다', () => {
    const body = document.createElement('div');
    body.innerHTML = '<h2>중복</h2><h2>중복</h2>';
    const first = preparePostHeadings(body, 'first');
    expect(preparePostHeadings(body, 'first')).toEqual(first);
    expect(preparePostHeadings(body, 'second').map(({ id }) => id)).not.toEqual(first.map(({ id }) => id));
  });
});
