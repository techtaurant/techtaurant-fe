const loadConfig = async (environment: string) => {
  jest.replaceProperty(process.env, 'NEXT_PUBLIC_ENV', environment);
  jest.resetModules();

  return import('@/shared/config');
};

describe('환경별 공통 상수', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('production에서는 상용 환경으로 판정하고 상용 도메인을 기준 주소로 쓴다', async () => {
    const config = await loadConfig('production');

    expect(config.IS_PRODUCTION).toBe(true);
    expect(config.SITE_URL).toBe('https://techtaurant.com');
  });

  it.each(['development', 'local'])(
    '%s에서는 상용 환경이 아니고 테섭 도메인을 기준 주소로 쓴다',
    async (environment) => {
      const config = await loadConfig(environment);

      expect(config.IS_PRODUCTION).toBe(false);
      expect(config.SITE_URL).toBe('https://dev.preview.techtaurant.com');
    },
  );
});
