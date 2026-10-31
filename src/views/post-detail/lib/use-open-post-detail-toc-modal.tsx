'use client';

import { overlay } from 'overlay-kit';
import { useEffect, useRef } from 'react';

import type { PostHeading } from '@/views/post-detail/model/use-post-headings';
import { PostDetailTocModal } from '@/views/post-detail/ui/post-detail-toc-modal';

type Params = {
  headings: PostHeading[];
};

export const useOpenPostDetailTocModal = ({ headings }: Params) => {
  const overlayIdRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (overlayIdRef.current) overlay.unmount(overlayIdRef.current);
    };
  }, []);

  return () => {
    overlayIdRef.current = overlay.open(({ overlayId, isOpen, unmount }) => (
      <PostDetailTocModal overlayId={overlayId} isOpen={isOpen} onClose={unmount} headings={headings} />
    ));
  };
};
