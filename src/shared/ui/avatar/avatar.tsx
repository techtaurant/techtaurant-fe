'use client';

import Image from 'next/image';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import type { ComponentProps, ReactEventHandler } from 'react';
import { useState } from 'react';

import { cn } from '@/shared/lib/cn';

function Avatar({
  className,
  size = 'default',
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: 'default' | 'sm';
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        'group/avatar after:border-border relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:mix-blend-darken data-[size=sm]:size-6 dark:after:mix-blend-lighten',
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, alt, src, onError, ...props }: ComponentProps<typeof Image>) {
  const [failedSrc, setFailedSrc] = useState<typeof src>();

  const handleImageError: ReactEventHandler<HTMLImageElement> = (event) => {
    setFailedSrc(src);
    onError?.(event);
  };

  if (failedSrc === src) return null;

  return (
    <Image
      data-slot="avatar-image"
      src={src}
      alt={alt}
      fill
      sizes="32px"
      className={cn('rounded-full object-cover', className)}
      onError={handleImageError}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs',
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        'group/avatar-group *:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2',
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        'bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=sm]/avatar-group:size-6',
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
