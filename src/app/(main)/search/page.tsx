import type { Metadata } from 'next';

import { SearchView } from '@/views/search';
import { Header } from '@/widgets/header';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '검색',
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <>
      <Header />
      <SearchView />
    </>
  );
}
