'use client';

import { notFound } from 'next/navigation';
import { overlay } from 'overlay-kit';
import { useEffect, useRef } from 'react';

import { useSearchCategories } from '@/entities/category';
import { useGetUserProfileImage } from '@/entities/user';
import {
  PostCategoryFilterList,
  PostPeriodFilter,
  PostSortFilter,
  usePostListFilters,
} from '@/features/post-list-filter';
import { UserCategorySidebar } from '@/views/user-detail/ui/user-category-sidebar';
import { UserPostList } from '@/views/user-detail/ui/user-post-list';
import { UserProfileHeader } from '@/views/user-detail/ui/user-profile-header';
import { Header } from '@/widgets/header';

type Props = {
  userId: string;
};

export function UserDetailView({ userId }: Props) {
  const { filters, setCategoryFilter } = usePostListFilters();
  const { data: profile, isPending: isProfilePending, isError: isProfileError } = useGetUserProfileImage({ userId });
  const { data: categories } = useSearchCategories({ userId, path: '' });
  const categoryId = filters.categoryId;
  const sidebarIdRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (sidebarIdRef.current === null) return;

      overlay.unmount(sidebarIdRef.current);
      sidebarIdRef.current = null;
    };
  }, [userId]);

  const openCategorySidebar = () => {
    sidebarIdRef.current = overlay.open(({ isOpen, unmount }) => (
      <UserCategorySidebar
        isOpen={isOpen}
        onClose={unmount}
        userId={userId}
        categoryId={categoryId}
        onChange={setCategoryFilter}
      />
    ));
  };

  if (isProfilePending) return null;
  if (!isProfileError && !profile) notFound();
  if (!profile) return null;

  return (
    <>
      <Header onMenuClick={openCategorySidebar} />
      <div className="mx-auto flex max-w-350">
        <aside className="scrollbar-hidden border-border bg-sidebar sticky top-16 hidden h-[calc(100dvh-4rem)] w-70 shrink-0 self-start overflow-y-auto overscroll-contain border-r p-6 [overflow-anchor:none] md:block">
          <PostCategoryFilterList categories={categories ?? []} categoryId={categoryId} onChange={setCategoryFilter} />
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 md:px-6">
          <UserProfileHeader userId={userId} profile={profile} />
          <div className="border-border mb-4 flex flex-col gap-3 border-b py-3 md:flex-row md:items-center md:justify-between">
            <PostPeriodFilter />
            <PostSortFilter />
          </div>
          <UserPostList userId={userId} categoryId={categoryId} />
        </main>
      </div>
    </>
  );
}
