'use client';

import type { AnchorHTMLAttributes, MouseEvent } from 'react';

import { cn } from '@/shared/lib/cn';
import { DROPDOWN_ITEM_CLASS_NAME } from '@/shared/ui/dropdown/components/dropdown-item';
import { useDropdownContext } from '@/shared/ui/dropdown/providers/dropdown-provider';

type Props = AnchorHTMLAttributes<HTMLAnchorElement>;

export function DropdownLinkItem({ children, className, onClick, ...props }: Props) {
  const { setIsOpen } = useDropdownContext();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    setIsOpen(false);
  };

  return (
    <a onClick={handleClick} className={cn(DROPDOWN_ITEM_CLASS_NAME, className)} {...props}>
      {children}
    </a>
  );
}
