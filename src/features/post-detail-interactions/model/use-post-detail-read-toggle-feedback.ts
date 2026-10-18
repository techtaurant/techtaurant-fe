'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useGetMe } from '@/entities/user';
import { usePostDetailReadGuide } from '@/features/post-detail-interactions/model/use-post-detail-read-guide';
import { usePostDetailReadToggle } from '@/features/post-detail-interactions/model/use-post-detail-read-toggle';
import { toast } from '@/shared/ui/toast';

const MARK_READ_TOAST_MESSAGE = '👏 읽음 표시했어요';
const MARK_UNREAD_TOAST_MESSAGE = '미읽음으로 표시했어요';
const READ_TOGGLE_ERROR_TOAST_MESSAGE = '읽음 표시에 실패했어요';
const READ_TOGGLE_PRESS_RESET_MS = 320;

type Params = {
  postId: string;
  isRead: boolean;
  onMarkReadAnimationStart: () => void;
  onRequireLogin: () => void;
};

export const usePostDetailReadToggleFeedback = ({
  postId,
  isRead,
  onMarkReadAnimationStart,
  onRequireLogin,
}: Params) => {
  const { data: me } = useGetMe();
  const [isPressingReadToggle, setIsPressingReadToggle] = useState(false);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoggedIn = !!me;
  const { dismissReadGuide, isReadGuideVisible } = usePostDetailReadGuide();
  const { isReadToggleDisabled, toggleRead } = usePostDetailReadToggle({
    isRead,
    onError: () => {
      toast.error(READ_TOGGLE_ERROR_TOAST_MESSAGE);
    },
    onRequireLogin,
    onSuccess: (nextReadState) => {
      toast.success(nextReadState ? MARK_READ_TOAST_MESSAGE : MARK_UNREAD_TOAST_MESSAGE);
    },
    postId,
  });

  const resetPressStateLater = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }

    pressTimerRef.current = setTimeout(() => {
      setIsPressingReadToggle(false);
    }, READ_TOGGLE_PRESS_RESET_MS);
  }, []);

  const handleToggleRead = useCallback(() => {
    const nextReadState = !isRead;

    if (isLoggedIn && nextReadState) {
      onMarkReadAnimationStart();
    }

    if (isLoggedIn) {
      dismissReadGuide();
    }

    setIsPressingReadToggle(true);
    resetPressStateLater();
    toggleRead();
  }, [dismissReadGuide, isLoggedIn, isRead, onMarkReadAnimationStart, resetPressStateLater, toggleRead]);

  const handleReadPointerDown = useCallback(() => {
    if (!isLoggedIn) return;

    setIsPressingReadToggle(true);
  }, [isLoggedIn]);

  const handleReadPointerUp = useCallback(() => {
    if (!isLoggedIn) return;

    resetPressStateLater();
  }, [isLoggedIn, resetPressStateLater]);

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  return {
    handleReadPointerDown,
    handleReadPointerUp,
    handleToggleRead,
    isPressingReadToggle,
    isReadGuideVisible,
    isReadToggleDisabled,
  };
};
