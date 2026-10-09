'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/shared/lib/cn';
import { AuthSection } from '@/widgets/header/ui/auth-section';
import { GlobalSearchForm } from '@/widgets/header/ui/global-search-form';

type Props = {
  onMenuClick?: () => void;
};

export function Header({ onMenuClick }: Props) {
  return (
    <header className="bg-background border-border fixed top-0 z-50 flex h-16 w-full items-center border-b">
      <div className={cn('mx-auto flex w-full max-w-350 items-center justify-between px-4', 'md:px-6')}>
        {onMenuClick && (
          <button
            type="button"
            className={cn(
              'flex shrink-0 items-center rounded-md p-2 transition-colors duration-200',
              'hover:bg-muted md:hidden',
            )}
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
        <Link
          href="/"
          className={cn(
            'font-brand text-foreground cursor-pointer text-lg font-bold tracking-tight transition-opacity duration-200',
            'hover:opacity-80 md:text-2xl',
          )}
        >
          Techtaurant
        </Link>
        <GlobalSearchForm />
        <AuthSection />
      </div>
    </header>
  );
}
