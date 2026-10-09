import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';

import { parsePostListFilters, prefetchGetPostList, toPostListApiParams } from '@/entities/post-list';
import { PostListView } from '@/views/post-list';
import { Header } from '@/widgets/header';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: Props) {
  const queryClient = new QueryClient();
  const filters = parsePostListFilters(await searchParams);
  const cookieHeader = (await cookies()).toString();

  await prefetchGetPostList(queryClient, {
    params: toPostListApiParams(filters),
    options: {
      cache: 'no-store',
      cookieHeader,
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Header />
      <PostListView />
    </HydrationBoundary>
  );
}
