'use client';

import { useState } from 'react';

import { useGetDraftDetail } from '@/entities/post-write';
import { toast } from '@/shared/ui/toast';
import {
  CATEGORY_REQUIRED_MESSAGE,
  CONTENT_REQUIRED_MESSAGE,
  getPublishInvalidField,
  type PublishInvalidField,
  TITLE_REQUIRED_MESSAGE,
} from '@/views/post-write/lib/get-publish-invalid-field';
import type { PostDraft } from '@/views/post-write/model/post-draft';
import { EMPTY_DRAFT } from '@/views/post-write/model/post-draft';
import { useDraftIdSearchParam } from '@/views/post-write/model/use-draft-id-search-param';
import { useOpenPostWritePublishConfirmModal } from '@/views/post-write/model/use-open-post-write-publish-confirm-modal';
import { useSaveDraftAction } from '@/views/post-write/model/use-save-draft-action';

export const usePostWriteForm = () => {
  const [editedDraft, setEditedDraft] = useState<PostDraft | null>(null);
  const [invalidPublishField, setInvalidPublishField] = useState<PublishInvalidField>(null);

  const { draftId } = useDraftIdSearchParam();
  const { data: savedDraft } = useGetDraftDetail({ postId: draftId });
  const { isDraftSaving, saveDraft } = useSaveDraftAction();
  const openPostWritePublishConfirmModal = useOpenPostWritePublishConfirmModal();

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
    if (invalidPublishField === 'title') setInvalidPublishField(null);
    updateDraft({ title: nextTitle });
  };

  const handleContentChange = (nextContent: string) => {
    if (invalidPublishField === 'content') setInvalidPublishField(null);
    updateDraft({ content: nextContent });
  };

  const handleTagsChange = (nextTags: string[]) => {
    updateDraft({ tags: nextTags });
  };

  const handleCategoryPathChange = (nextCategoryPath: string) => {
    if (invalidPublishField === 'categoryPath') setInvalidPublishField(null);
    updateDraft({ categoryPath: nextCategoryPath });
  };

  const handleThumbnailChange = (nextThumbnailAttachmentId: string) => {
    updateDraft({ thumbnailAttachmentId: nextThumbnailAttachmentId });
  };

  const handleDraftSaveClick = () => {
    saveDraft({ categoryPath, content, tags, thumbnailAttachmentId, title });
  };

  const handlePublishClick = () => {
    const nextInvalidField = getPublishInvalidField({ categoryPath, content, title });
    setInvalidPublishField(nextInvalidField);

    if (nextInvalidField === 'title') {
      toast.error(TITLE_REQUIRED_MESSAGE);
      return;
    }

    if (nextInvalidField === 'categoryPath') {
      toast.error(CATEGORY_REQUIRED_MESSAGE);
      return;
    }

    if (nextInvalidField === 'content') {
      toast.error(CONTENT_REQUIRED_MESSAGE);
      return;
    }

    openPostWritePublishConfirmModal({ categoryPath, content, tags, thumbnailAttachmentId, title });
  };

  return {
    categoryPath,
    content,
    handleCategoryPathChange,
    handleContentChange,
    handleDraftSaveClick,
    handlePublishClick,
    handleTagsChange,
    handleThumbnailChange,
    handleTitleChange,
    invalidPublishField,
    isDraftSaving,
    tags,
    thumbnailAttachmentId,
    title,
  };
};
