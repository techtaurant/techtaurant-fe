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
import { usePostWriteAutoSave } from '@/views/post-write/model/use-post-write-auto-save';
import { useSaveDraftAction } from '@/views/post-write/model/use-save-draft-action';
import { useUnsavedChangesWarning } from '@/views/post-write/model/use-unsaved-changes-warning';

type PostWriteFormRefs = {
  categoryRef: RefObject<HTMLInputElement | null>;
  contentRef: RefObject<HTMLTextAreaElement | null>;
  titleRef: RefObject<HTMLInputElement | null>;
};

export const usePostWriteForm = ({ categoryRef, contentRef, titleRef }: PostWriteFormRefs) => {
  const [editedDraft, setEditedDraft] = useState<PostDraft | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { draftId } = useDraftIdSearchParam();
  const { data: savedDraft } = useGetDraftDetail({ postId: draftId });
  const { isDraftSaving, saveDraft, saveDraftSilentlyOrThrow } = useSaveDraftAction();
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
  const draft = editedDraft ?? restoredDraft ?? EMPTY_DRAFT;
  const { categoryPath, content, tags, thumbnailAttachmentId, title } = draft;

  const { cancelScheduledSave } = usePostWriteAutoSave({
    draft,
    hasUnsavedChanges,
    onSaveSuccess: () => setHasUnsavedChanges(false),
    save: saveDraftSilentlyOrThrow,
  });
  useUnsavedChangesWarning(hasUnsavedChanges);

  const updateDraft = (changes: Partial<PostDraft>) => {
    setEditedDraft({ categoryPath, content, tags, thumbnailAttachmentId, title, ...changes });
    setHasUnsavedChanges(true);
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
    cancelScheduledSave();
    saveDraft(
      { categoryPath, content, tags, thumbnailAttachmentId, title },
      { onSuccess: () => setHasUnsavedChanges(false) },
    );
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
