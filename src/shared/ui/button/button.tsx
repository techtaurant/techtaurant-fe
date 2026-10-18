'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@/shared/lib/cn';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, size, variant, type = 'button', ...props }, ref) => {
    return <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);

Button.displayName = 'Button';

// TODO: Codex 기반 초안 variant라서 추후 살짝씩 수정해서 공통 버튼 UI를 정리해보면 좋을 것 같습니다.
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-button-primary text-background hover:bg-button-primary-hover rounded-full',
        primarySurface: 'bg-button-primary-surface hover:bg-button-primary-surface-hover text-white',
        neutral: 'bg-button-neutral-surface text-foreground hover:bg-button-neutral-surface-hover',
        danger: 'bg-button-danger-surface hover:bg-button-danger-surface-hover text-white',
        ghost: 'text-foreground hover:bg-muted bg-transparent',
        icon: 'text-muted-foreground hover:bg-muted hover:text-foreground bg-transparent',
        outline: 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/85 border bg-transparent',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-9 px-3.5 text-sm',
        lg: 'h-11 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  },
);
