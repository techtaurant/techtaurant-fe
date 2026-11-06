import type { Metadata } from 'next';

import { PostWriteDraftListView } from '@/views/post-write';
import { Header } from '@/widgets/header';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '임시저장',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Header />
      <PostWriteDraftListView />
    </>
  );
}
