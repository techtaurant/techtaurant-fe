'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { getPostDetailQueryKey, useRecordPostView } from '@/entities/post-detail';
import { getPostListQueryKey } from '@/entities/post-list';

type Params = {
  enabled: boolean;
  postId: string;
};

export const useRecordPostViewOnce = ({ enabled, postId }: Params) => {
  const recordedPostIdRef = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const { mutate } = useRecordPostView();

  useEffect(() => {
    if (!enabled || recordedPostIdRef.current === postId) return;

    recordedPostIdRef.current = postId;

    mutate(
      { postId },
      {
        onSuccess: () => {
          void Promise.all([
            queryClient.invalidateQueries({ queryKey: getPostDetailQueryKey(postId) }),
            queryClient.invalidateQueries({ queryKey: getPostListQueryKey() }),
          ]);
        },
      },
    );
  }, [enabled, mutate, postId, queryClient]);
};
