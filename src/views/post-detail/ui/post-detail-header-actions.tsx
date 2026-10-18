'use client';

import { MoreHorizontal, UserX } from 'lucide-react';
import { useRef, useState } from 'react';

import { useOutsideClick } from '@/shared/lib/use-outside-click';
import { Button } from '@/shared/ui/button';

type Props = {
  isAuthPending: boolean;
  isFollowingAuthor: boolean;
  isFollowingUpdating: boolean;
  onRequestBlockAuthor: () => void;
  onToggleAuthorFollow: () => void;
};

const FOLLOW_BUTTON_CLASS_NAME =
  'bg-follow-button-surface text-follow-button-foreground hover:bg-follow-button-surface-hover h-[34px] rounded-md px-4 whitespace-nowrap';
const FOLLOWING_BUTTON_CLASS_NAME =
  'bg-following-button-surface text-following-button-foreground hover:bg-following-button-surface-hover h-[34px] rounded-md px-4 whitespace-nowrap';
const FOLLOW_BUTTON_LABEL = '팔로우';
const FOLLOWING_BUTTON_LABEL = '팔로잉';
const BLOCK_AUTHOR_MENU_LABEL = '차단하기';

export function PostDetailHeaderActions({
  isAuthPending,
  isFollowingAuthor,
  isFollowingUpdating,
  onRequestBlockAuthor,
  onToggleAuthorFollow,
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleToggleAuthorFollow = () => {
    onToggleAuthorFollow();
  };

  const handleRequestBlockAuthor = () => {
    setIsMenuOpen(false);
    onRequestBlockAuthor();
  };

  useOutsideClick({
    enabled: isMenuOpen,
    refs: [menuRef],
    callbackFn: () => setIsMenuOpen(false),
  });

  return (
    <div ref={menuRef} className="relative ml-auto flex items-center gap-2">
      <Button
        variant="icon"
        size="sm"
        className="h-9 w-9 rounded-full px-0 hover:bg-transparent"
        disabled={isAuthPending}
        onClick={handleMenuToggle}
      >
        <MoreHorizontal className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={isFollowingAuthor ? FOLLOWING_BUTTON_CLASS_NAME : FOLLOW_BUTTON_CLASS_NAME}
        disabled={isAuthPending || isFollowingUpdating}
        onClick={handleToggleAuthorFollow}
      >
        {isFollowingAuthor ? FOLLOWING_BUTTON_LABEL : FOLLOW_BUTTON_LABEL}
      </Button>

      {isMenuOpen && (
        <div className="border-border bg-background absolute top-12 right-0 z-20 min-w-[120px] rounded-xl border p-1 shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            className="text-foreground hover:bg-muted/80 w-full justify-start rounded-md px-3 py-2 text-left text-sm font-semibold"
            disabled={isAuthPending}
            onClick={handleRequestBlockAuthor}
          >
            <span className="inline-flex items-center gap-2">
              <UserX className="text-foreground h-3.5 w-3.5" />
              {BLOCK_AUTHOR_MENU_LABEL}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
