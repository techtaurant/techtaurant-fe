import { act, fireEvent, render, screen } from '@testing-library/react';

import type { CategoryResponse } from '@/entities/category';
import { PostCategoryFilterList } from '@/features/post-list-filter/ui/post-category-filter-list';

const categories: CategoryResponse[] = [
  { id: 'dev', name: '개발', path: '개발', depth: 1, postCount: 2 },
  { id: 'os', name: '운영체제', path: '개발/운영체제', parentId: 'dev', depth: 2, postCount: 2 },
  { id: 'macos', name: 'macos', path: '개발/운영체제/macos', parentId: 'os', depth: 3, postCount: 1 },
  { id: 'tools', name: '개발도구', path: '개발도구', depth: 1, postCount: 1 },
  { id: 'editor', name: '에디터', path: '개발도구/에디터', parentId: 'tools', depth: 2, postCount: 1 },
];
const scrollIntoView = jest.fn();
const scrollDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView');

describe('선택한 카테고리 펼침과 포커스', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    scrollIntoView.mockClear();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });
    jest.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([new DOMRect()] as unknown as DOMRectList);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
    if (scrollDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', scrollDescriptor);
    } else {
      Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
    }
  });

  it.each([
    ['macos', 'macos 1'],
    ['os', '운영체제 2'],
  ])('선택 경로를 펼치고 선택 항목에 포커스와 스크롤을 적용한다 (%s)', (categoryId, name) => {
    render(<PostCategoryFilterList categories={categories} categoryId={categoryId} onChange={jest.fn()} />);

    const selected = screen.getByRole('button', { name });
    expect(selected).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'macos 1' })).toBeVisible();
    expect(screen.getByRole('button', { name: '개발 하위 카테고리 접기' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: '개발도구 하위 카테고리 펼치기' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    act(() => jest.runOnlyPendingTimers());

    expect(selected).toHaveFocus();
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
    expect(scrollIntoView.mock.instances[0]).toBe(selected);
  });

  it('카테고리를 늦게 불러와도 선택 경로를 펼치고 포커스를 적용한다', () => {
    const { rerender } = render(<PostCategoryFilterList categories={[]} categoryId="macos" onChange={jest.fn()} />);
    act(() => jest.runOnlyPendingTimers());

    rerender(<PostCategoryFilterList categories={categories} categoryId="macos" onChange={jest.fn()} />);
    act(() => jest.runOnlyPendingTimers());

    expect(screen.getByRole('button', { name: 'macos 1' })).toHaveFocus();
  });

  it('선택 카테고리가 바뀌면 새 경로를 펼치고 포커스를 옮긴다', () => {
    const { rerender } = render(
      <PostCategoryFilterList categories={categories} categoryId="macos" onChange={jest.fn()} />,
    );
    act(() => jest.runOnlyPendingTimers());

    rerender(<PostCategoryFilterList categories={categories} categoryId="editor" onChange={jest.fn()} />);
    act(() => jest.runOnlyPendingTimers());

    expect(screen.getByRole('button', { name: '에디터 1' })).toHaveFocus();
    expect(screen.getByRole('button', { name: '개발도구 하위 카테고리 접기' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('선택한 경로도 사용자가 직접 접고 다시 펼칠 수 있다', () => {
    render(<PostCategoryFilterList categories={categories} categoryId="macos" onChange={jest.fn()} />);
    act(() => jest.runOnlyPendingTimers());

    fireEvent.click(screen.getByRole('button', { name: '개발 하위 카테고리 접기' }));
    expect(screen.queryByRole('button', { name: 'macos 1' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '개발 하위 카테고리 펼치기' }));
    expect(screen.getByRole('button', { name: 'macos 1' })).toBeVisible();
  });

  it.each([undefined, 'unknown'])(
    '유효한 선택이 없으면 자동으로 펼치거나 포커스를 옮기지 않는다 (%s)',
    (categoryId) => {
      render(<PostCategoryFilterList categories={categories} categoryId={categoryId} onChange={jest.fn()} />);
      act(() => jest.runOnlyPendingTimers());

      expect(screen.getByRole('button', { name: '개발 하위 카테고리 펼치기' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(document.body).toHaveFocus();
      expect(scrollIntoView).not.toHaveBeenCalled();
    },
  );

  it('모바일에서 숨겨진 데스크톱 목록은 포커스를 가져가지 않는다', () => {
    jest.mocked(HTMLElement.prototype.getClientRects).mockReturnValue([] as unknown as DOMRectList);
    render(<PostCategoryFilterList categories={categories} categoryId="dev" onChange={jest.fn()} />);
    act(() => jest.runOnlyPendingTimers());

    expect(document.body).toHaveFocus();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
