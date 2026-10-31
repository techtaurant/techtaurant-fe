'use client';

import { useEffect, useRef } from 'react';

import { Modal, ModalHeader } from '@/shared/ui/modal';
import type { PostHeading } from '@/views/post-detail/model/use-post-headings';
import { PostDetailTocList } from '@/views/post-detail/ui/post-detail-toc-list';

type Props = {
  overlayId: string;
  isOpen: boolean;
  onClose: () => void;
  headings: PostHeading[];
};

export function PostDetailTocModal({ overlayId, isOpen, onClose, headings }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const trigger = document.activeElement;
    dialogRef.current?.querySelector('button')?.focus();

    return () => {
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return (
    <Modal id={overlayId} isOpen={isOpen} onClose={onClose} className="max-w-[420px] rounded-2xl">
      <div ref={dialogRef}>
        <ModalHeader title="목차" onClose={onClose} />
        <div className="p-5 [&_nav]:max-h-[min(62dvh,520px)]">
          <PostDetailTocList headings={headings} onNavigate={onClose} />
        </div>
      </div>
    </Modal>
  );
}
