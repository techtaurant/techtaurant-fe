'use client';

import { useMutation } from '@tanstack/react-query';

import {
  ATTACHMENT_ACCEPTED_MIME_TYPES,
  ATTACHMENT_MAX_SIZE_BYTES,
  ATTACHMENT_MAX_SIZE_MEGABYTES,
  uploadAttachment,
} from '@/entities/attachment';
import { PresignedUrlRequestReferenceType } from '@/shared/api/generated';
import { toast } from '@/shared/ui/toast';

const UPLOAD_FAILED_MESSAGE = '이미지를 업로드하지 못했어요. 잠시 후 다시 시도해주세요.';
const TYPE_NOT_ALLOWED_MESSAGE = 'JPG, PNG, GIF, WebP, AVIF 형식만 올릴 수 있어요.';
const TOO_LARGE_MESSAGE = `이미지는 ${ATTACHMENT_MAX_SIZE_MEGABYTES}MB까지 올릴 수 있어요.`;

export const usePostAttachmentUpload = () => {
  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadAttachment({ file, referenceType: PresignedUrlRequestReferenceType.POST }),
  });

  const isUploading = uploadMutation.isPending;

  const uploadImage = (file: File, onUploaded: (attachmentId: string) => void) => {
    if (!ATTACHMENT_ACCEPTED_MIME_TYPES.includes(file.type)) {
      toast.error(TYPE_NOT_ALLOWED_MESSAGE);
      return;
    }

    if (file.size > ATTACHMENT_MAX_SIZE_BYTES) {
      toast.error(TOO_LARGE_MESSAGE);
      return;
    }

    uploadMutation.mutate(file, {
      onSuccess: (uploaded) => {
        if (!uploaded) return;

        onUploaded(uploaded.attachmentId);
      },
      onError: () => toast.error(UPLOAD_FAILED_MESSAGE),
    });
  };

  return { isUploading, uploadImage };
};
