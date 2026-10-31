'use client';

import { ListTree } from 'lucide-react';
import type { RefObject } from 'react';

import { Button } from '@/shared/ui/button';
import { useOpenPostDetailTocModal } from '@/views/post-detail/lib/use-open-post-detail-toc-modal';
import { usePostHeadings } from '@/views/post-detail/model/use-post-headings';
import { PostDetailTocList } from '@/views/post-detail/ui/post-detail-toc-list';

type Props = { contentRef: RefObject<HTMLDivElement | null> };

export function PostDetailToc({ contentRef }: Props) {
  const headings = usePostHeadings({ contentRef });
  const openTocModal = useOpenPostDetailTocModal({ headings });

  if (headings.length === 0) return null;

  return (
    <>
      <aside className="absolute inset-y-0 left-full hidden w-[min(20rem,calc((100vw-48rem)/2))] pl-6 xl:block">
        <div className="border-border sticky top-20 border-l pl-6">
          <PostDetailTocList headings={headings} />
        </div>
      </aside>
      <Button
        variant="outline"
        onClick={openTocModal}
        className="bg-background/95 fixed top-20 right-4 z-40 h-11 w-11 rounded-full p-0 shadow-lg backdrop-blur md:right-6 xl:hidden"
      >
        <ListTree className="h-5 w-5" />
      </Button>
      <div className="h-dvh" />
    </>
  );
}
