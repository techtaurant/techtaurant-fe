import type { PostDraft } from '@/views/post-write/model/post-draft';

export type PublishInvalidField = 'categoryPath' | 'content' | 'title' | null;

export const TITLE_REQUIRED_MESSAGE = '제목을 입력해주세요.';
export const CATEGORY_REQUIRED_MESSAGE = '카테고리를 입력해주세요.';
export const CONTENT_REQUIRED_MESSAGE = '본문을 입력해주세요.';

export const getPublishInvalidField = ({
  categoryPath,
  content,
  title,
}: Pick<PostDraft, 'categoryPath' | 'content' | 'title'>): PublishInvalidField => {
  if (!title.trim()) return 'title';
  if (!categoryPath.trim()) return 'categoryPath';
  if (!content.trim()) return 'content';
  return null;
};
