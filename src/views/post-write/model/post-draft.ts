export type PostDraft = {
  categoryPath: string;
  content: string;
  tags: string[];
  title: string;
};

export const EMPTY_DRAFT = { categoryPath: '', content: '', tags: [], title: '' } satisfies PostDraft;
