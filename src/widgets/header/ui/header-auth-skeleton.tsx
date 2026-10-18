import { cn } from '@/shared/lib/cn';

export function HeaderAuthSkeleton() {
  return (
    <div className="flex shrink-0 items-center gap-2" role="status">
      <span className="bg-muted h-8 w-8 animate-pulse rounded-full" />
      <span className={cn('bg-muted hidden h-4 w-12 animate-pulse rounded', 'md:inline')} />
      <span className="sr-only">로그인 상태를 확인하는 중입니다.</span>
    </div>
  );
}
