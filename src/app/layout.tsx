import '@/app/globals.css';

import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

import { ReactQueryProvider } from '@/shared/api/react-query-provider';
import { DEFAULT_SHARE_IMAGE_URL, IS_SEARCH_INDEXING_ALLOWED, SITE_NAME, SITE_URL } from '@/shared/config';
import { montserrat, pretendard } from '@/shared/config/fonts';
import { cn } from '@/shared/lib/cn';
import { ModalProvider } from '@/shared/ui/modal';
import { ToastsRoot } from '@/shared/ui/toast';

// 공개 페이지는 robots를 따로 지정하지 않고 이 값을 상속한다.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} Techtaurant | 개발 경험과 기술 지식을 나누는 공간`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    '테크토랑은 개발 경험과 기술 지식을 공유하는 공간입니다. 다양한 기술 이야기와 문제 해결 경험을 만나보세요.',
  robots: IS_SEARCH_INDEXING_ALLOWED ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'ko_KR',
    images: [DEFAULT_SHARE_IMAGE_URL],
  },
  twitter: { card: 'summary_large_image' },
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={cn('bg-background text-foreground antialiased', pretendard.className, montserrat.variable)}>
        <ThemeProvider attribute="data-mode">
          <ReactQueryProvider>
            <ModalProvider>
              {children}
              <ToastsRoot />
            </ModalProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
