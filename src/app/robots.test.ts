import robots from '@/app/robots';

describe('robots.txt', () => {
  it('모든 크롤러에 전체 경로를 허용하고 차단 규칙을 두지 않는다', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
    });
  });
});
