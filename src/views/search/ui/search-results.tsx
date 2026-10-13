'use client';

import { useGetPostList } from '@/entities/post-list';
import { useSearchKeyword } from '@/features/post-search';
import { Observer } from '@/shared/ui/intersection-observer';
import { SearchResultsStatus } from '@/views/search/ui/search-results-status';
import { PostCard } from '@/widgets/post-card';

export function SearchResults() {
  const keyword = useSearchKeyword();
  const isValidKeyword = keyword.length >= 2 && keyword.length <= 100;

  const {
    data: posts = [],
    isPending,
    isFetching,
    isPlaceholderData,
    isError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetPostList({
    enabled: isValidKeyword,
    params: { keyword, size: 20 },
  });

  const handleLoadMore = () => {
    if (!hasNextPage || isFetching) return;
    void fetchNextPage();
  };

  if (!keyword) {
    return <p className="text-muted-foreground py-20 text-center text-sm">검색어를 입력하세요.</p>;
  }

  if (!isValidKeyword) {
    return (
      <p className="text-muted-foreground py-20 text-center text-sm">검색어는 2자 이상 100자 이하로 입력해주세요.</p>
    );
  }

  return (
    <section>
      <SearchResultsStatus
        isError={isError && posts.length === 0}
        isLoading={isPending || isPlaceholderData}
        isEmpty={posts.length === 0}
        onRetry={refetch}
      >
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        {hasNextPage && <Observer onEnter={handleLoadMore} />}
      </SearchResultsStatus>
    </section>
  );
}
