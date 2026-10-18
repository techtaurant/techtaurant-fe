'use client';

import type { KeyboardEvent } from 'react';
import { useState } from 'react';

type Params = {
  onDismiss?: () => void;
};

export const useSuggestionDropdown = ({ onDismiss }: Params = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const openSuggestions = () => {
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const closeSuggestions = () => {
    setIsOpen(false);
  };

  const handleNavigationKeyDown = (event: KeyboardEvent<HTMLInputElement>, suggestionCount: number) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      onDismiss?.();
      return true;
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return false;

    if (!isOpen || suggestionCount === 0) {
      openSuggestions();
      return true;
    }

    event.preventDefault();
    const step = event.key === 'ArrowDown' ? 1 : -1;
    setActiveIndex((currentIndex) => {
      if (currentIndex === -1) return step === 1 ? 0 : suggestionCount - 1;

      return (Math.min(currentIndex, suggestionCount - 1) + step + suggestionCount) % suggestionCount;
    });

    return true;
  };

  return {
    activeIndex,
    closeSuggestions,
    handleNavigationKeyDown,
    isOpen,
    openSuggestions,
  };
};
