'use client';

import { UserX } from 'lucide-react';

import { useGetMe } from '@/entities/user';
import { useOpenUserBlockConfirmModal } from '@/features/user-block/lib/use-open-user-block-confirm-modal';
import { Button } from '@/shared/ui/button';

type Props = {
  userId: string;
  userName: string;
  onRequireLogin: () => void;
  onSuccess: () => void;
};

export function UserBlockButton({ userId, userName, onRequireLogin, onSuccess }: Props) {
  const { data: me, isPending } = useGetMe();

  const openUserBlockConfirmModal = useOpenUserBlockConfirmModal({
    userId,
    userName,
    onSuccess,
  });

  if (isPending || me?.id === userId) return null;

  const handleClick = () => {
    if (!me) {
      onRequireLogin();
      return;
    }

    openUserBlockConfirmModal();
  };

  return (
    <Button
      variant="neutral"
      className="text-muted-foreground h-10 w-10 shrink-0 rounded-md p-2"
      aria-label="차단"
      onClick={handleClick}
    >
      <UserX className="h-5 w-5" />
    </Button>
  );
}
