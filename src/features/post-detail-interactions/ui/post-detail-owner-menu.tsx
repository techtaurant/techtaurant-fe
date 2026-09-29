'use client';

import { MoreHorizontal, Trash2 } from 'lucide-react';

import { useOpenPostDetailDeleteConfirmModal } from '@/features/post-detail-interactions/lib/use-open-post-detail-delete-confirm-modal';
import { DropdownContent, DropdownItem, DropdownProvider, DropdownTrigger } from '@/shared/ui/dropdown';

type Props = {
  postId: string;
};

const DELETE_POST_LABEL = '삭제';

export function PostDetailOwnerMenu({ postId }: Props) {
  const openPostDetailDeleteConfirmModal = useOpenPostDetailDeleteConfirmModal({ postId });

  return (
    <DropdownProvider className="relative ml-auto shrink-0">
      <DropdownTrigger className="text-muted-foreground hover:bg-muted hover:text-foreground h-9 w-9 rounded-full transition-colors">
        <MoreHorizontal className="h-5 w-5" />
      </DropdownTrigger>
      <DropdownContent align="end" className="min-w-36 rounded-xl">
        <DropdownItem
          className="text-button-danger-surface hover:text-button-danger-surface"
          onClick={openPostDetailDeleteConfirmModal}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {DELETE_POST_LABEL}
        </DropdownItem>
      </DropdownContent>
    </DropdownProvider>
  );
}
