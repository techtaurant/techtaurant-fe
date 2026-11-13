import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { parsePostListFilters, prefetchGetPostList, toPostListApiParams } from '@/entities/post-list';
import { fetchUserProfileImage, prefetchUserFollowCounts } from '@/entities/user';
import type { CustomFetchInit } from '@/shared/api/custom-fetch';
import { getUserProfileImagesApi } from '@/shared/api/generated';
import { isUuid } from '@/shared/lib/is-uuid';
import { buildUserDetailMetadata, UserDetailView } from '@/views/user-detail';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ userId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { userId } = await params;
  const filters = parsePostListFilters(await searchParams);
  const options: CustomFetchInit = { cache: 'no-store', cookieHeader: (await cookies()).toString() };

  try {
    const response = await getUserProfileImagesApi({ userIds: [userId] }, options);

    return buildUserDetailMetadata(response.data?.[0], filters);
  } catch {
    return buildUserDetailMetadata(undefined, filters);
  }
}

export default async function Page({ params, searchParams }: Props) {
  const queryClient = new QueryClient();

  const { userId } = await params;
  // 프로필 API의 userIds는 UUID 형식만 허용합니다.
  if (!isUuid(userId)) notFound();

  const filters = parsePostListFilters(await searchParams);
  const options = { cache: 'no-store', cookieHeader: (await cookies()).toString() } as const;

  const [profile] = await Promise.all([
    fetchUserProfileImage(queryClient, { userId, options }),
    prefetchUserFollowCounts(queryClient, userId, options),
  ]);

  // 조회 결과에 사용자가 없는 경우 404 처리
  if (!profile) notFound();

  await prefetchGetPostList(queryClient, {
    params: { ...toPostListApiParams(filters), authorId: userId },
    options,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserDetailView userId={userId} />
    </HydrationBoundary>
  );
}
