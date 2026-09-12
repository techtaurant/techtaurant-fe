'use client';

import { useState } from 'react';

import { useGetDraftDetail } from '@/entities/post-write';
import type { PostDraft } from '@/views/post-write/model/post-draft';
import { EMPTY_DRAFT } from '@/views/post-write/model/post-draft';
import { useDraftIdSearchParam } from '@/views/post-write/model/use-draft-id-search-param';
import { useSaveDraftAction } from '@/views/post-write/model/use-save-draft-action';

export const usePostWriteForm = () => {
  const [editedDraft, setEditedDraft] = useState<PostDraft | null>(null);

  const { draftId } = useDraftIdSearchParam();
  const { data: savedDraft } = useGetDraftDetail({ postId: draftId });
  const { isDraftSaving, saveDraft } = useSaveDraftAction();

  const restoredDraft = savedDraft && {
    categoryPath: savedDraft.category?.path ?? '',
    content: savedDraft.content,
    tags: savedDraft.tags.map(({ name }) => name),
    thumbnailAttachmentId: savedDraft.thumbnailAttachmentId ?? '',
    title: savedDraft.title,
  };
  const { categoryPath, content, tags, thumbnailAttachmentId, title } = editedDraft ?? restoredDraft ?? EMPTY_DRAFT;

  const updateDraft = (changes: Partial<PostDraft>) => {
    setEditedDraft({ categoryPath, content, tags, thumbnailAttachmentId, title, ...changes });
  };

  const handleTitleChange = (nextTitle: string) => {
    updateDraft({ title: nextTitle });
  };

  const handleContentChange = (nextContent: string) => {
    updateDraft({ content: nextContent });
  };

  const handleTagsChange = (nextTags: string[]) => {
    updateDraft({ tags: nextTags });
  };

  const handleCategoryPathChange = (nextCategoryPath: string) => {
    updateDraft({ categoryPath: nextCategoryPath });
  };

  const handleThumbnailChange = (nextThumbnailAttachmentId: string) => {
    updateDraft({ thumbnailAttachmentId: nextThumbnailAttachmentId });
  };

  const handleDraftSaveClick = () => {
    saveDraft({ categoryPath, content, tags, thumbnailAttachmentId, title });
  };

  return {
    categoryPath,
    content,
    handleCategoryPathChange,
    handleContentChange,
    handleDraftSaveClick,
    handleTagsChange,
    handleThumbnailChange,
    handleTitleChange,
    isDraftSaving,
    tags,
    thumbnailAttachmentId,
    title,
  };
};
