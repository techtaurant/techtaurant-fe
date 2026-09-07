import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { fetchPostDetail } from '@/entities/post-detail';
import { PostDetailView } from '@/views/post-detail';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    postId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { postId } = await params;
  const queryClient = new QueryClient();
  const cookieHeader = (await cookies()).toString();

  try {
    await fetchPostDetail(queryClient, {
      postId,
      options: {
        cache: 'no-store',
        cookieHeader,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.cause === 404) {
      notFound();
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetailView postId={postId} />
    </HydrationBoundary>
  );
}
