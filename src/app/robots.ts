import type { MetadataRoute } from 'next';

// Sitemap 주소는 BE 사이트맵 엔드포인트가 확정된 뒤 rewrite와 함께 추가한다(#109).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
  };
}
