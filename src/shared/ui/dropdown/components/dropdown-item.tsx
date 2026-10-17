'use client';

import type { ButtonHTMLAttributes, MouseEvent } from 'react';

import { cn } from '@/shared/lib/cn';
import { useDropdownContext } from '@/shared/ui/dropdown/providers/dropdown-provider';

export const DROPDOWN_ITEM_CLASS_NAME = cn(
  'text-foreground flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm leading-none font-semibold transition-colors outline-none',
  'hover:bg-muted focus-visible:bg-muted active:bg-muted select-none',
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  preventClose?: boolean;
};

export function DropdownItem({ children, className, onClick, preventClose = false, ...props }: Props) {
  const { setIsOpen } = useDropdownContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!preventClose) setIsOpen(false);
  };

  return (
    <button type="button" onClick={handleClick} className={cn(DROPDOWN_ITEM_CLASS_NAME, className)} {...props}>
      {children}
    </button>
  );
}
