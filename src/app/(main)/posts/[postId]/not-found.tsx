import { PostDetailFallback } from '@/views/post-detail/ui/post-detail-fallback';
import { Header } from '@/widgets/header';

export default function NotFound() {
  return (
    <>
      <Header />
      <PostDetailFallback />
    </>
  );
}
