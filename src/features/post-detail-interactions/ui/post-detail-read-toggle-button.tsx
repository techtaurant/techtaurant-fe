'use client';

import type { LottieRefCurrentProps } from 'lottie-react';
import Lottie from 'lottie-react';
import { useCallback, useEffect, useRef } from 'react';

import { usePostDetailReadToggleFeedback } from '@/features/post-detail-interactions/model/use-post-detail-read-toggle-feedback';
import readCheckAnimation from '@/shared/assets/read-check-success.json';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

const READ_TOGGLE_GUIDE_TEXT = '해당 아이콘을 눌러 읽음 상태를 바꿔보세요!';

type Props = {
  isRead: boolean;
  onRequireLogin: () => void;
  postId: string;
};

export function PostDetailReadToggleButton({ isRead, onRequireLogin, postId }: Props) {
  const showReadCheckedIconRef = useRef(isRead);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const readStatusLabel = getReadStatusLabel(isRead);
  const {
    handleReadPointerDown,
    handleReadPointerUp,
    handleToggleRead,
    isPressingReadToggle,
    isReadGuideVisible,
    isReadToggleDisabled,
  } = usePostDetailReadToggleFeedback({
    isRead,
    onMarkReadAnimationStart: () => {
      showReadCheckedIconRef.current = false;
    },
    onRequireLogin,
    postId,
  });

  const syncLottieToReadState = useCallback((nextState: boolean) => {
    if (!lottieRef.current) return;

    if (!nextState) {
      lottieRef.current.goToAndStop(0, true);
      return;
    }

    if (showReadCheckedIconRef.current) {
      const finalFrame = lottieRef.current.getDuration(true);
      lottieRef.current.goToAndStop(getSafeLottieFrame(finalFrame), true);
      return;
    }

    lottieRef.current.goToAndStop(0, true);
    lottieRef.current.play();
  }, []);

  const handleReadCheckAnimationComplete = useCallback(() => {
    if (isRead) {
      showReadCheckedIconRef.current = true;
    }
  }, [isRead]);

  useEffect(() => {
    if (!isRead) {
      showReadCheckedIconRef.current = false;
    }

    syncLottieToReadState(isRead);
  }, [isRead, syncLottieToReadState]);

  return (
    <div className="relative">
      {isReadGuideVisible && (
        <p className="border-border bg-background text-foreground absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded-full border px-3 py-1 text-[11px] whitespace-nowrap shadow-sm">
          {READ_TOGGLE_GUIDE_TEXT}
        </p>
      )}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'relative h-10 w-10 rounded-full px-0 hover:bg-transparent',
          isPressingReadToggle ? 'scale-[0.94]' : 'scale-100',
        )}
        disabled={isReadToggleDisabled}
        title={readStatusLabel}
        onClick={handleToggleRead}
        onPointerCancel={handleReadPointerUp}
        onPointerDown={handleReadPointerDown}
        onPointerLeave={handleReadPointerUp}
        onPointerUp={handleReadPointerUp}
      >
        <span className="relative inline-flex h-10 w-10 items-center justify-center">
          <Lottie
            animationData={readCheckAnimation}
            autoplay={false}
            className={cn(
              'block h-10 w-10 translate-y-px',
              isRead ? 'opacity-100 grayscale-0' : 'opacity-[0.55] grayscale',
              isPressingReadToggle ? 'scale-[0.98]' : 'scale-100',
            )}
            loop={false}
            lottieRef={lottieRef}
            onComplete={handleReadCheckAnimationComplete}
            onDOMLoaded={() => {
              syncLottieToReadState(isRead);
            }}
          />
        </span>
      </Button>
    </div>
  );
}

const getReadStatusLabel = (isRead: boolean) => {
  if (isRead) return '읽음 표시 해제';

  return '읽음 표시';
};

const getSafeLottieFrame = (frame?: number) => {
  if (typeof frame === 'number') return frame;

  return 0;
};
