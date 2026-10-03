'use client';

import { extractAttachmentIds, useGetTmpPreviewUrls } from '@/entities/post-write';
import type { PostDetailAttachmentPresignedUrlResponse } from '@/shared/api/generated';

type Params = {
  content: string;
  savedAttachmentUrls: PostDetailAttachmentPresignedUrlResponse[];
  thumbnailAttachmentId: string;
};

export const usePostAttachmentPreviews = ({ content, savedAttachmentUrls, thumbnailAttachmentId }: Params) => {
  const contentAttachmentIds = extractAttachmentIds(content);
  const requestedAttachmentIds = thumbnailAttachmentId
    ? [...new Set([thumbnailAttachmentId, ...contentAttachmentIds])]
    : contentAttachmentIds;

  const savedAttachmentIds = new Set(savedAttachmentUrls.map(({ attachmentId }) => attachmentId));
  const tmpAttachmentIds = requestedAttachmentIds.filter((attachmentId) => !savedAttachmentIds.has(attachmentId));

  const { data: tmpAttachmentUrls } = useGetTmpPreviewUrls({ attachmentIds: tmpAttachmentIds });

  const attachmentPreviewUrls = [...savedAttachmentUrls, ...(tmpAttachmentUrls ?? [])];
  const presignedUrlByAttachmentId = new Map(
    attachmentPreviewUrls.map(({ attachmentId, presignedUrl }) => [attachmentId, presignedUrl]),
  );

  return {
    attachmentPreviewUrls,
    thumbnailUrl: presignedUrlByAttachmentId.get(thumbnailAttachmentId),
  };
};
