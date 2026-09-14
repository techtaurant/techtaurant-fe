'use client';

import { ImagePlus } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useId } from 'react';

import { ATTACHMENT_ACCEPTED_MIME_TYPES } from '@/entities/attachment';
import { cn } from '@/shared/lib/cn';
import { buttonVariants } from '@/shared/ui/button';

type Props = {
  isUploading: boolean;
  onImageSelect: (file: File) => void;
};

export function PostWriteImageButton({ isUploading, onImageSelect }: Props) {
  const inputId = useId();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    onImageSelect(file);
  };

  return (
    <>
      <label
        htmlFor={inputId}
        className={cn(
          buttonVariants({ size: 'md', variant: 'neutral' }),
          'shrink-0',
          isUploading ? 'pointer-events-none opacity-60' : 'cursor-pointer',
        )}
      >
        <ImagePlus className="h-4 w-4" />
        {isUploading ? '업로드 중...' : '이미지'}
      </label>
      <input
        accept={ATTACHMENT_ACCEPTED_MIME_TYPES.join(',')}
        className="sr-only"
        disabled={isUploading}
        id={inputId}
        onChange={handleInputChange}
        type="file"
      />
    </>
  );
}
