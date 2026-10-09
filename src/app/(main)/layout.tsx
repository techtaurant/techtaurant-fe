import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { BottomNavigation } from '@/widgets/bottom-navigation';

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <main>
      <div className={cn('min-h-screen py-16', 'md:pb-0')}>{children}</div>
      <BottomNavigation />
    </main>
  );
}
