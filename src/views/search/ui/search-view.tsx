import { PostSearchForm } from '@/features/post-search';
import { SearchResults } from '@/views/search/ui/search-results';

export function SearchView() {
  return (
    <div className="mx-auto w-full max-w-200 px-4 py-6 md:px-6">
      <h1 className="sr-only">게시글 검색</h1>
      <PostSearchForm />
      <SearchResults />
    </div>
  );
}
