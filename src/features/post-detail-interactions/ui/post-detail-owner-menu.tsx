'use client';

import { Eye, EyeOff, MoreHorizontal, Trash2 } from 'lucide-react';

import { useOpenPostDetailDeleteConfirmModal } from '@/features/post-detail-interactions/lib/use-open-post-detail-delete-confirm-modal';
import { usePostDetailVisibility } from '@/features/post-detail-interactions/model/use-post-detail-visibility';
import { DropdownContent, DropdownItem, DropdownProvider, DropdownTrigger } from '@/shared/ui/dropdown';
import { toast } from '@/shared/ui/toast';

type Props = {
  isPrivate: boolean;
  postId: string;
};

const MAKE_PRIVATE_LABEL = '비공개';
const MAKE_PUBLIC_LABEL = '공개';
const DELETE_POST_LABEL = '삭제';
const MADE_PRIVATE_MESSAGE = '비공개로 전환했어요.';
const MADE_PUBLIC_MESSAGE = '공개로 전환했어요.';
const VISIBILITY_UPDATE_FAILED_MESSAGE = '전환하지 못했어요. 잠시 후 다시 시도해주세요.';

export function PostDetailOwnerMenu({ isPrivate, postId }: Props) {
  const { isVisibilityUpdating, toggleVisibility } = usePostDetailVisibility({
    onError: () => toast.error(VISIBILITY_UPDATE_FAILED_MESSAGE),
    onSuccess: () => toast.success(isPrivate ? MADE_PUBLIC_MESSAGE : MADE_PRIVATE_MESSAGE),
    isPrivate,
    postId,
  });
  const openPostDetailDeleteConfirmModal = useOpenPostDetailDeleteConfirmModal({ postId });

  const handleVisibilityToggleClick = () => {
    if (isVisibilityUpdating) return;

    toggleVisibility();
  };

  return (
    <DropdownProvider className="relative ml-auto shrink-0">
      <DropdownTrigger className="text-muted-foreground hover:bg-muted hover:text-foreground h-9 w-9 rounded-full transition-colors">
        <MoreHorizontal className="h-5 w-5" />
      </DropdownTrigger>
      <DropdownContent align="end" className="min-w-36 rounded-xl">
        <DropdownItem onClick={handleVisibilityToggleClick}>
          {isPrivate ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {isPrivate ? MAKE_PUBLIC_LABEL : MAKE_PRIVATE_LABEL}
        </DropdownItem>
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
