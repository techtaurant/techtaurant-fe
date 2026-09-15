'use client';

import type { RefObject } from 'react';
import { useState } from 'react';

import { useGetDraftDetail } from '@/entities/post-write';
import { toast } from '@/shared/ui/toast';
import {
  CATEGORY_REQUIRED_MESSAGE,
  CONTENT_REQUIRED_MESSAGE,
  getPublishInvalidField,
  TITLE_REQUIRED_MESSAGE,
} from '@/views/post-write/lib/get-publish-invalid-field';
import type { PostDraft } from '@/views/post-write/model/post-draft';
import { EMPTY_DRAFT } from '@/views/post-write/model/post-draft';
import { useDraftIdSearchParam } from '@/views/post-write/model/use-draft-id-search-param';
import { useOpenPostWritePublishConfirmModal } from '@/views/post-write/model/use-open-post-write-publish-confirm-modal';
import { useSaveDraftAction } from '@/views/post-write/model/use-save-draft-action';

type PostWriteFormRefs = {
  categoryRef: RefObject<HTMLInputElement | null>;
  contentRef: RefObject<HTMLTextAreaElement | null>;
  titleRef: RefObject<HTMLInputElement | null>;
};

export const usePostWriteForm = ({ categoryRef, contentRef, titleRef }: PostWriteFormRefs) => {
  const [editedDraft, setEditedDraft] = useState<PostDraft | null>(null);

  const { draftId } = useDraftIdSearchParam();
  const { data: savedDraft } = useGetDraftDetail({ postId: draftId });
  const { isDraftSaving, saveDraft } = useSaveDraftAction();
  const openPostWritePublishConfirmModal = useOpenPostWritePublishConfirmModal();

  const invalidFieldConfig = {
    categoryPath: { message: CATEGORY_REQUIRED_MESSAGE, ref: categoryRef },
    content: { message: CONTENT_REQUIRED_MESSAGE, ref: contentRef },
    title: { message: TITLE_REQUIRED_MESSAGE, ref: titleRef },
  };

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

  const handlePublishClick = () => {
    const invalidField = getPublishInvalidField({ categoryPath, content, title });

    if (invalidField) {
      const { message, ref } = invalidFieldConfig[invalidField];
      toast.error(message);
      ref.current?.focus();
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
    isDraftSaving,
    tags,
    thumbnailAttachmentId,
    title,
  };
};
