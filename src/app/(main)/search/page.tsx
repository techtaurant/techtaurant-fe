import { SearchView } from '@/views/search';
import { Header } from '@/widgets/header';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <>
      <Header />
      <SearchView />
    </>
  );
}
