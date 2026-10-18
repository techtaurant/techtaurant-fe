export type PostDraft = {
  categoryPath: string;
  content: string;
  tags: string[];
  thumbnailAttachmentId: string;
  title: string;
};

export const EMPTY_DRAFT = {
  categoryPath: '',
  content: '',
  tags: [],
  thumbnailAttachmentId: '',
  title: '',
} satisfies PostDraft;
