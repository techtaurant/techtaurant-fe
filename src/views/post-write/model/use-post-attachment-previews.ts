'use client';

import { extractAttachmentIds, useGetTmpPreviewUrls } from '@/entities/post-write';
import { useSavedDraft } from '@/views/post-write/model/use-saved-draft';

type Params = {
  content: string;
  thumbnailAttachmentId: string;
};

export const usePostAttachmentPreviews = ({ content, thumbnailAttachmentId }: Params) => {
  const { savedDraft } = useSavedDraft();

  const contentAttachmentIds = extractAttachmentIds(content);
  const requestedAttachmentIds = thumbnailAttachmentId
    ? [...new Set([thumbnailAttachmentId, ...contentAttachmentIds])]
    : contentAttachmentIds;

  const savedAttachmentUrls = savedDraft?.attachmentPresignedUrls ?? [];
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
