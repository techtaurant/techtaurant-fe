'use client';

import { useSearchParams } from 'next/navigation';
import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

import { useGetDraftDetail } from '@/entities/post-write';
import { useGetMe } from '@/entities/user';
import { PostDetailResponseStatus } from '@/shared/api/generated';
import { getSearchParamValue } from '@/shared/lib/search-params';
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
import { useOpenDraftList } from '@/views/post-write/model/use-open-draft-list';
import { useOpenPostWritePublishConfirmModal } from '@/views/post-write/model/use-open-post-write-publish-confirm-modal';
import { usePostEditAction } from '@/views/post-write/model/use-post-edit-action';
import { usePostWriteAutoSave } from '@/views/post-write/model/use-post-write-auto-save';
import { useSaveDraftAction } from '@/views/post-write/model/use-save-draft-action';
import { useUnsavedChangesWarning } from '@/views/post-write/model/use-unsaved-changes-warning';

const EDIT_POST_ID_SEARCH_PARAM_KEY = 'postId';

type PostWriteFormRefs = {
  categoryRef: RefObject<HTMLInputElement | null>;
  contentRef: RefObject<HTMLTextAreaElement | null>;
  titleRef: RefObject<HTMLInputElement | null>;
};

export const usePostWriteForm = ({ categoryRef, contentRef, titleRef }: PostWriteFormRefs) => {
  const [editedDraft, setEditedDraft] = useState<PostDraft | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const searchParams = useSearchParams();

  const editPostId = getSearchParamValue(searchParams, EDIT_POST_ID_SEARCH_PARAM_KEY);
  const isEditMode = !!editPostId;

  const { clearDraftId, draftId } = useDraftIdSearchParam();
  const { data: me } = useGetMe();
  const { data: savedDraft, error: draftDetailError } = useGetDraftDetail({ postId: editPostId ?? draftId });
  const { isDraftSaving, saveDraft, saveDraftSilentlyOrThrow } = useSaveDraftAction();
  const openPostWritePublishConfirmModal = useOpenPostWritePublishConfirmModal();
  const { editPost, isPostEditing } = usePostEditAction();

  const invalidFieldConfig = {
    categoryPath: { message: CATEGORY_REQUIRED_MESSAGE, ref: categoryRef },
    content: { message: CONTENT_REQUIRED_MESSAGE, ref: contentRef },
    title: { message: TITLE_REQUIRED_MESSAGE, ref: titleRef },
  };

  const isDraftNotFound = draftDetailError instanceof Error && draftDetailError.cause === 404;
  const isOtherAuthorPost = !!savedDraft && !!me && savedDraft.author.id !== me.id;
  const shouldResetToNewPost = isDraftNotFound || isOtherAuthorPost;
  const ownSavedDraft = isOtherAuthorPost ? undefined : savedDraft;
  const restoredDraft = ownSavedDraft && {
    categoryPath: ownSavedDraft.category?.path ?? '',
    content: ownSavedDraft.content,
    tags: ownSavedDraft.tags.map(({ name }) => name),
    thumbnailAttachmentId: ownSavedDraft.thumbnailAttachmentId ?? '',
    title: ownSavedDraft.title,
  };
  const lastSavedAt = ownSavedDraft?.updatedAt;
  const isPrivate = ownSavedDraft?.status === PostDetailResponseStatus.PRIVATE;
  const savedAttachmentUrls = ownSavedDraft?.attachmentPresignedUrls ?? [];
  const draft = editedDraft ?? restoredDraft ?? EMPTY_DRAFT;
  const { categoryPath, content, tags, thumbnailAttachmentId, title } = draft;

  const { cancelScheduledSave, flushPendingSave } = usePostWriteAutoSave({
    draft,
    hasUnsavedChanges,
    isEnabled: !isEditMode,
    onSaveSuccess: () => setHasUnsavedChanges(false),
    save: saveDraftSilentlyOrThrow,
  });
  useUnsavedChangesWarning(hasUnsavedChanges);
  const openDraftList = useOpenDraftList({ flushPendingSave });

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

  const focusInvalidField = () => {
    const invalidField = getPublishInvalidField({ categoryPath, content, title });

    if (!invalidField) return false;

    const { message, ref } = invalidFieldConfig[invalidField];
    toast.error(message);
    ref.current?.focus();
    return true;
  };

  const handlePublishClick = () => {
    if (focusInvalidField()) return;

    cancelScheduledSave();
    openPostWritePublishConfirmModal({ categoryPath, content, tags, thumbnailAttachmentId, title });
  };

  const handlePostEditClick = () => {
    if (!editPostId || focusInvalidField()) return;

    editPost({ draft: { categoryPath, content, tags, thumbnailAttachmentId, title }, isPrivate, postId: editPostId });
  };

  useEffect(() => {
    if (!shouldResetToNewPost) return;

    clearDraftId();
  }, [clearDraftId, shouldResetToNewPost]);

  return {
    categoryPath,
    content,
    editPostId,
    handleCategoryPathChange,
    handleContentChange,
    handleDraftSaveClick,
    handlePostEditClick,
    handlePublishClick,
    handleTagsChange,
    handleThumbnailChange,
    handleTitleChange,
    isDraftSaving,
    isEditMode,
    isPostEditing,
    lastSavedAt,
    openDraftList,
    savedAttachmentUrls,
    tags,
    thumbnailAttachmentId,
    title,
  };
};
