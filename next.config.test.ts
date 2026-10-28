const loadHeaders = async (environment: string) => {
  jest.replaceProperty(process.env, 'NEXT_PUBLIC_ENV', environment);
  jest.resetModules();
  const { default: nextConfig } = await import('./next.config');

  return nextConfig.headers?.();
};

describe('next.config 응답 헤더', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('production에서는 검색 제외 헤더를 붙이지 않는다', async () => {
    await expect(loadHeaders('production')).resolves.toEqual([]);
  });

  it('development에서는 모든 경로 응답에 X-Robots-Tag noindex, nofollow를 붙인다', async () => {
    await expect(loadHeaders('development')).resolves.toEqual([
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]);
  });
});
