import { PostWriteDraftListView } from '@/views/post-write';
import { Header } from '@/widgets/header';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <>
      <Header />
      <PostWriteDraftListView />
    </>
  );
}
