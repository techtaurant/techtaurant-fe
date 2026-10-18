'use client';

import { useCurrentOverlay } from 'overlay-kit';
import type { HTMLAttributes, MouseEvent } from 'react';

import { cn } from '@/shared/lib/cn';
import { useKeyDownEffect } from '@/shared/lib/use-key-down-effect';

type Props = HTMLAttributes<HTMLDivElement> & {
  id: string;
  isOpen: boolean;
  onClose: () => void;
};

export function Modal({ id, isOpen, onClose, ...props }: Props) {
  const { children, className, ...restProps } = props;
  const currentOverlayId = useCurrentOverlay();

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKeyDown = () => {
    if (currentOverlayId === id) {
      onClose();
    }
  };

  useKeyDownEffect({
    enabled: isOpen,
    key: 'Escape',
    callbackFn: handleEscapeKeyDown,
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'border-border/80 bg-modal-surface text-foreground max-h-[calc(100dvh-2rem)] w-full max-w-140 overflow-hidden rounded-3xl border shadow-2xl',
          className,
        )}
        {...restProps}
      >
        {children}
      </div>
    </div>
  );
}
