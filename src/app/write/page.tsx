import type { Metadata } from 'next';

import { PostWriteView } from '@/views/post-write';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '글쓰기',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PostWriteView />;
}
