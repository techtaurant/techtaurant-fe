'use client';

import { useSearchParams } from 'next/navigation';

import { useGetDraftDetail } from '@/entities/post-write';
import { useGetMe } from '@/entities/user';
import { getSearchParamValue } from '@/shared/lib/search-params';
import { useDraftIdSearchParam } from '@/views/post-write/model/use-draft-id-search-param';

const EDIT_POST_ID_SEARCH_PARAM_KEY = 'postId';

export const useSavedDraft = () => {
  const searchParams = useSearchParams();

  const editPostId = getSearchParamValue(searchParams, EDIT_POST_ID_SEARCH_PARAM_KEY);

  const { draftId } = useDraftIdSearchParam();
  const { data: me } = useGetMe();
  const { data: loadedDraft, error: draftDetailError } = useGetDraftDetail({ postId: editPostId ?? draftId });

  const isDraftNotFound = draftDetailError instanceof Error && draftDetailError.cause === 404;
  const isOtherAuthorPost = !!loadedDraft && !!me && loadedDraft.author.id !== me.id;

  return {
    editPostId,
    savedDraft: isOtherAuthorPost ? undefined : loadedDraft,
    shouldResetToNewPost: isDraftNotFound || isOtherAuthorPost,
  };
};
