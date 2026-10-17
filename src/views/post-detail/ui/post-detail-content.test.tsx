import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PostDetailContent } from '@/views/post-detail/ui/post-detail-content';

const props = { attachmentPresignedUrls: [], postId: 'post-one' };

describe('게시물 상세 목차', () => {
  it('정제된 실제 본문의 h2/h3에만 연결하고 링크 활성화 시 제목으로 포커스를 옮긴다', async () => {
    const user = userEvent.setup();
    render(
      <PostDetailContent
        {...props}
        content={'# 제외\n\n## 한국어 **제목**\n\n### 한국어 제목\n\n#### 제외\n\n```md\n## 코드\n```'}
      />,
    );
    const navigation = screen.getByRole('navigation', { name: '본문 목차' });
    const links = within(navigation).getAllByRole('link', { name: '한국어 제목' });
    expect(links).toHaveLength(2);
    expect(links[0]).not.toHaveAttribute('href', links[1].getAttribute('href'));
    await user.tab();
    expect(links[0]).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('heading', { level: 2, name: '한국어 제목' })).toHaveFocus();
    expect(links[0]).toHaveAttribute('href', `#${document.activeElement?.id}`);
    expect(within(navigation).queryByRole('link', { name: '코드' })).not.toBeInTheDocument();
  });

  it('본문과 게시물이 바뀌면 이전 제목과 ID를 남기지 않는다', () => {
    const { rerender } = render(<PostDetailContent {...props} content="## 이전 제목" />);
    const previousHref = screen.getByRole('link', { name: '이전 제목' }).getAttribute('href');
    rerender(<PostDetailContent {...props} postId="post-two" content="### 다음 제목" />);
    expect(screen.queryByRole('link', { name: '이전 제목' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '다음 제목' })).not.toHaveAttribute('href', previousHref);
    rerender(<PostDetailContent {...props} content="일반 문단만 있습니다." />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.getByText('일반 문단만 있습니다.')).toBeInTheDocument();
  });

  it('본문을 유지한 재조회에도 제목 ID와 포커스 대상을 복구한다', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<PostDetailContent {...props} content="## 같은 본문" />);
    const href = screen.getByRole('link', { name: '같은 본문' }).getAttribute('href');
    rerender(<PostDetailContent {...props} attachmentPresignedUrls={[]} content="## 같은 본문" />);
    await user.click(screen.getByRole('link', { name: '같은 본문' }));
    expect(screen.getByRole('heading', { name: '같은 본문' })).toHaveFocus();
    expect(href).toBe(`#${document.activeElement?.id}`);
  });

  it('HTML 제목도 포함하고 악성 HTML은 기존 본문 경계에서 제거한다', () => {
    const { container } = render(
      <PostDetailContent
        {...props}
        content={'<h2>HTML 제목</h2>\n\n<img src="x" onerror="alert(1)"><script>alert(1)</script>'}
      />,
    );
    expect(screen.getByRole('link', { name: 'HTML 제목' })).toHaveAttribute(
      'href',
      `#${screen.getByRole('heading', { level: 2, name: 'HTML 제목' }).id}`,
    );
    expect(container.querySelector('script, [onerror]')).not.toBeInTheDocument();
  });
});
