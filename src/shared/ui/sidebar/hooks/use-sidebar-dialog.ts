'use client';

import { useEffect, useRef } from 'react';

import { useIsDesktop } from '@/shared/lib/use-is-desktop';

type Params = {
  isOpen: boolean;
  onClose: () => void;
};

export function useSidebarDialog({ isOpen, onClose }: Params) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isDesktop) {
      onClose();
      return;
    }

    const trigger = document.activeElement;
    // 네이티브 dialog로 배경 상호작용과 포커스 이동 범위를 제한합니다.
    dialog.showModal();

    return () => {
      dialog.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, [isOpen, isDesktop, onClose]);

  return dialogRef;
}
