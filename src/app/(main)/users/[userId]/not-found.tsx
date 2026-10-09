import { UserDetailFallback } from '@/views/user-detail';
import { Header } from '@/widgets/header';

export default function NotFound() {
  return (
    <>
      <Header />
      <UserDetailFallback />
    </>
  );
}
