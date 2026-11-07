import { cache } from 'react';

import type { CustomFetchInit } from '@/shared/api/custom-fetch';
import { getPostDetailApi } from '@/shared/api/generated';

// page와 generateMetadata의 중복 조회를 한 요청 안에서 합친다. cache는 인자를 동일성으로 비교하므로 옵션 객체 대신 문자열을 받는다.
export const loadPostDetail = cache(async (postId: string, cookieHeader: string) => {
  const options: CustomFetchInit = { cache: 'no-store', cookieHeader };

  return getPostDetailApi(postId, options);
});
