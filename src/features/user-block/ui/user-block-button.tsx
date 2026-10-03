'use client';

import { UserX } from 'lucide-react';
import { overlay } from 'overlay-kit';

import { useGetMe } from '@/entities/user';
import { UserBlockConfirmModal } from '@/features/user-block/ui/user-block-confirm-modal';
import { Button } from '@/shared/ui/button';

type Props = {
  userId: string;
  userName: string;
  onRequireLogin: () => void;
  onSuccess: () => void;
};

export function UserBlockButton({ userId, userName, onRequireLogin, onSuccess }: Props) {
  const { data: me, isPending } = useGetMe();

  if (isPending || me?.id === userId) return null;

  const handleClick = () => {
    if (!me) {
      onRequireLogin();
      return;
    }

    overlay.open(({ overlayId, isOpen, unmount }) => (
      <UserBlockConfirmModal
        id={overlayId}
        isOpen={isOpen}
        onClose={unmount}
        userId={userId}
        userName={userName}
        onSuccess={onSuccess}
      />
    ));
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
