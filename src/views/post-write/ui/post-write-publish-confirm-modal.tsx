'use client';

import { useState } from 'react';

import { CreatePostRequestStatus } from '@/shared/api/generated';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import type { PostDraft } from '@/views/post-write/model/post-draft';
import { usePublishAction } from '@/views/post-write/model/use-publish-action';

type Props = {
  draft: PostDraft;
  isOpen: boolean;
  onClose: () => void;
  overlayId: string;
};

const PUBLISH_CONFIRM_TITLE = '게시물을 발행할까요?';
const PUBLISH_CONFIRM_ACTION = '발행하기';
const PUBLISH_PENDING_ACTION = '발행 중...';
const PUBLISH_CANCEL_ACTION = '취소';
const VISIBILITY_PUBLIC_TITLE = '공개';
const VISIBILITY_PUBLIC_DESCRIPTION = '모든 사용자가 이 게시물을 볼 수 있어요.';
const VISIBILITY_PRIVATE_TITLE = '비공개';
const VISIBILITY_PRIVATE_DESCRIPTION = '나만 볼 수 있어요. 곧 지원할 예정이에요.';

export function PostWritePublishConfirmModal({ draft, isOpen, onClose, overlayId }: Props) {
  const [visibility, setVisibility] = useState<CreatePostRequestStatus>(CreatePostRequestStatus.PUBLISHED);

  const isPublicSelected = visibility === CreatePostRequestStatus.PUBLISHED;

  const { isPublishing, publish } = usePublishAction();

  const handleModalClose = () => {
    if (isPublishing) return;
    onClose();
  };

  const handlePublicSelect = () => {
    setVisibility(CreatePostRequestStatus.PUBLISHED);
  };

  const handlePublishClick = () => {
    if (isPublishing) return;
    publish(draft, { onSuccess: onClose });
  };

  return (
    <Modal
      id={overlayId}
      isOpen={isOpen}
      onClose={handleModalClose}
      className="max-w-lg rounded-2xl border-0 p-6 shadow-xl"
    >
      <h2 className="text-foreground text-xl font-semibold">{PUBLISH_CONFIRM_TITLE}</h2>

      <div className="mt-5 flex flex-col gap-3">
        <Button
          variant={isPublicSelected ? 'primarySurface' : 'outline'}
          className="h-auto w-full flex-col items-start gap-1 rounded-xl p-4 text-left"
          onClick={handlePublicSelect}
        >
          <span className="text-base font-semibold">{VISIBILITY_PUBLIC_TITLE}</span>
          <span className="text-sm font-normal opacity-80">{VISIBILITY_PUBLIC_DESCRIPTION}</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto w-full flex-col items-start gap-1 rounded-xl p-4 text-left"
          disabled
        >
          <span className="text-base font-semibold">{VISIBILITY_PRIVATE_TITLE}</span>
          <span className="text-sm font-normal opacity-80">{VISIBILITY_PRIVATE_DESCRIPTION}</span>
        </Button>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="neutral"
          className="h-10 px-5 font-semibold"
          disabled={isPublishing}
          onClick={handleModalClose}
        >
          {PUBLISH_CANCEL_ACTION}
        </Button>
        <Button
          variant="primarySurface"
          className="h-10 px-5 font-semibold"
          disabled={isPublishing}
          onClick={handlePublishClick}
        >
          {isPublishing ? PUBLISH_PENDING_ACTION : PUBLISH_CONFIRM_ACTION}
        </Button>
      </div>
    </Modal>
  );
}
