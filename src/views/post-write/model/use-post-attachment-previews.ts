'use client';

import { extractAttachmentIds, useGetTmpPreviewUrls } from '@/entities/post-write';

type Params = {
  content: string;
};

export const usePostAttachmentPreviews = ({ content }: Params) => {
  const { data: attachmentPreviewUrls } = useGetTmpPreviewUrls({ attachmentIds: extractAttachmentIds(content) });

  return { attachmentPreviewUrls: attachmentPreviewUrls ?? [] };
};
