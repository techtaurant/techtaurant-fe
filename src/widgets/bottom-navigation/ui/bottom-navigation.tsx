'use client';

import { FileText, Search, SquarePen, UserRound } from 'lucide-react';
import type { MouseEvent } from 'react';

import { useGetMe } from '@/entities/user';
import { startGoogleLogin } from '@/features/auth/lib/login';
import { cn } from '@/shared/lib/cn';
import { BottomNavigationLink } from '@/widgets/bottom-navigation/ui/bottom-navigation-link';

export function BottomNavigation() {
  const { data: me } = useGetMe();

  const handleAuthRequiredClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (me) return true;

    event.preventDefault();
    startGoogleLogin();
    return false;
  };

  return (
    <nav className={cn('border-border bg-background fixed inset-x-0 bottom-0 z-40 border-t', 'md:hidden')}>
      <div className={cn('mx-auto grid h-16 max-w-130 grid-cols-4 px-2')}>
        <BottomNavigationLink href="/posts">
          <FileText className={cn('h-5 w-5')} />
          <span>게시글</span>
        </BottomNavigationLink>
        <BottomNavigationLink href="/search">
          <Search className={cn('h-5 w-5')} />
          <span>검색</span>
        </BottomNavigationLink>
        <BottomNavigationLink href="/write" onClick={handleAuthRequiredClick}>
          <SquarePen className={cn('h-5 w-5')} />
          <span>글쓰기</span>
        </BottomNavigationLink>
        {me ? (
          <BottomNavigationLink href={`/users/${me.id}`}>
            <UserRound className="h-5 w-5" />
            <span>내 글</span>
          </BottomNavigationLink>
        ) : (
          <button
            type="button"
            onClick={() => startGoogleLogin()}
            className="text-muted-foreground hover:text-foreground flex min-h-14 min-w-14 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors"
          >
            <UserRound className="h-5 w-5" />
            <span>내 글</span>
          </button>
        )}
      </div>
    </nav>
  );
}
