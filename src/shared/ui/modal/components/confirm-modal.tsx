'use client';

import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal/components/modal';

type Props = {
  confirmLabel: string;
  description: string;
  id: string;
  isConfirming?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
};

const CANCEL_LABEL = '취소';

export function ConfirmModal({
  confirmLabel,
  description,
  id,
  isConfirming = false,
  isOpen,
  onClose,
  onConfirm,
  title,
}: Props) {
  const handleModalClose = () => {
    if (isConfirming) return;

    onClose();
  };

  return (
    <Modal id={id} isOpen={isOpen} onClose={handleModalClose} className="max-w-xs rounded-2xl border-0 p-5 shadow-xl">
      <h2 className="text-foreground text-lg font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>

      <div className="mt-5 flex justify-center">
        <div className="flex w-full min-w-0 flex-wrap gap-2">
          <Button
            variant="neutral"
            className="h-10 min-w-34 flex-1 rounded-lg px-4 py-2 text-center text-sm font-semibold whitespace-nowrap"
            disabled={isConfirming}
            onClick={handleModalClose}
          >
            {CANCEL_LABEL}
          </Button>
          <Button
            variant="danger"
            className="h-10 min-w-34 flex-1 rounded-lg px-4 py-2 text-center text-sm font-semibold whitespace-nowrap"
            disabled={isConfirming}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
