import '@/app/globals.css';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

import { ReactQueryProvider } from '@/shared/api/react-query-provider';
import { montserrat, pretendard } from '@/shared/config/fonts';
import { cn } from '@/shared/lib/cn';
import { ModalProvider } from '@/shared/ui/modal';
import { ToastsRoot } from '@/shared/ui/toast';

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
