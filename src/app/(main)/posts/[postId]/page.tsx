import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { fetchPostDetail } from '@/entities/post-detail';
import type { CustomFetchInit } from '@/shared/api/custom-fetch';
import { getPostDetailApi } from '@/shared/api/generated';
import { buildPostDetailMetadata, PostDetailView } from '@/views/post-detail';
import { Header } from '@/widgets/header';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    postId: string;
  }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { postId } = await params;
  const cookieHeader = (await cookies()).toString();
  const parentOpenGraph = (await parent).openGraph;
  const options: CustomFetchInit = { cache: 'no-store', cookieHeader };

  try {
    const response = await getPostDetailApi(postId, options);

    return buildPostDetailMetadata(response.data, parentOpenGraph);
  } catch {
    // 비공개 글의 401, 없는 글의 404 같은 조회 실패는 모두 글 내용을 숨기는 메타데이터로 처리한다.
    return buildPostDetailMetadata(undefined, parentOpenGraph);
  }
}

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
      <Header />
      <PostDetailView postId={postId} />
    </HydrationBoundary>
  );
}
