'use client';

import { ImageUp } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useId } from 'react';

import { ATTACHMENT_ACCEPTED_MIME_TYPES } from '@/entities/attachment';
import { PostThumbnail } from '@/entities/post-list';
import { cn } from '@/shared/lib/cn';
import { buttonVariants } from '@/shared/ui/button';
import { usePostAttachmentUpload } from '@/views/post-write/model/use-post-attachment-upload';

type Props = {
  onThumbnailChange: (thumbnailAttachmentId: string) => void;
  thumbnailUrl?: string;
};

export function PostWriteThumbnailField({ onThumbnailChange, thumbnailUrl }: Props) {
  const inputId = useId();

  const { isUploading, uploadImage } = usePostAttachmentUpload();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    uploadImage(file, onThumbnailChange);
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
        <ImageUp className="h-4 w-4" />
        {getLabel({ hasThumbnail: !!thumbnailUrl, isUploading })}
      </label>
      <input
        accept={ATTACHMENT_ACCEPTED_MIME_TYPES.join(',')}
        className="sr-only"
        disabled={isUploading}
        id={inputId}
        onChange={handleInputChange}
        type="file"
      />

      {thumbnailUrl && (
        <PostThumbnail
          alt="대표 이미지 미리보기"
          className="h-12 w-20 md:h-12 md:w-20"
          sizes="80px"
          src={thumbnailUrl}
        />
      )}
    </>
  );
}

const getLabel = ({ hasThumbnail, isUploading }: { hasThumbnail: boolean; isUploading: boolean }) => {
  if (isUploading) return '업로드 중...';

  return hasThumbnail ? '대표 이미지 변경' : '대표 이미지 선택';
};
