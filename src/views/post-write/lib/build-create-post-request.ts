import { extractAttachmentIds } from '@/entities/post-write';
import type { CreatePostRequest, CreatePostRequestStatus } from '@/shared/api/generated';
import type { PostDraft } from '@/views/post-write/model/post-draft';

export const buildCreatePostRequest = (
  { categoryPath, content, tags, thumbnailAttachmentId, title }: PostDraft,
  status: CreatePostRequestStatus,
): CreatePostRequest => ({
  attachmentIds: extractAttachmentIds(content),
  categoryPath,
  content,
  status,
  tags,
  title,
  ...(thumbnailAttachmentId && { thumbnailAttachmentId }),
});
