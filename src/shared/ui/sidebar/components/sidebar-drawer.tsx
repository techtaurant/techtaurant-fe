'use client';

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { MouseEvent, ReactNode, SyntheticEvent } from 'react';
import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import { useSidebarDialog } from '@/shared/ui/sidebar/hooks/use-sidebar-dialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: (close: () => void) => ReactNode;
};

export function SidebarDrawer({ isOpen, onClose, children }: Props) {
  const dialogRef = useSidebarDialog({ isOpen, onClose });
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    handleClose();
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) handleClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-black/40"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <AnimatePresence onExitComplete={onClose}>
        {isOpen && !isClosing && (
          <motion.div
            key="sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
            className="border-border bg-background text-foreground relative flex h-full w-70 max-w-[85vw] flex-col border-r shadow-2xl"
          >
            <Button variant="icon" size="sm" className="absolute top-4 right-4 h-8 w-8 px-0" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
            <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
              {children(handleClose)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
