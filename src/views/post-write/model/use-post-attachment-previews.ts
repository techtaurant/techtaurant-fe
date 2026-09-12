'use client';

import { extractAttachmentIds, useGetTmpPreviewUrls } from '@/entities/post-write';

type Params = {
  content: string;
  thumbnailAttachmentId: string;
};

export const usePostAttachmentPreviews = ({ content, thumbnailAttachmentId }: Params) => {
  const contentAttachmentIds = extractAttachmentIds(content);
  const requestedAttachmentIds = thumbnailAttachmentId
    ? [...new Set([thumbnailAttachmentId, ...contentAttachmentIds])]
    : contentAttachmentIds;

  const { data: attachmentPreviewUrls } = useGetTmpPreviewUrls({ attachmentIds: requestedAttachmentIds });

  const presignedUrlByAttachmentId = new Map(
    (attachmentPreviewUrls ?? []).map(({ attachmentId, presignedUrl }) => [attachmentId, presignedUrl]),
  );

  return {
    attachmentPreviewUrls: attachmentPreviewUrls ?? [],
    thumbnailUrl: presignedUrlByAttachmentId.get(thumbnailAttachmentId),
  };
};
