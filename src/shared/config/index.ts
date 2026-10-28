export const IS_SERVER = typeof window === 'undefined';

export const API_BASE_URL = (() => {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL 환경 변수를 확인해주세요.');
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL;
})();

export const ENVIRONMENT = (() => {
  if (!process.env.NEXT_PUBLIC_ENV) {
    throw new Error('NEXT_PUBLIC_ENV 환경 변수를 확인해주세요.');
  }
  return process.env.NEXT_PUBLIC_ENV as 'local' | 'development' | 'production';
})();

const IS_PRODUCTION = ENVIRONMENT === 'production';

export const IS_SEARCH_INDEXING_ALLOWED = IS_PRODUCTION;

export const SITE_URL = IS_PRODUCTION ? 'https://techtaurant.com' : 'https://dev.preview.techtaurant.com';

export const SITE_NAME = '테크토랑';

export const DEFAULT_SHARE_IMAGE_URL = `${API_BASE_URL}/static/images/post-thumbnail.png`;
