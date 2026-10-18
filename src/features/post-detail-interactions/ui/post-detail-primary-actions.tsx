import { Eye, MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

const COUNT_TEN_THOUSAND_UNIT = 10000;
const COUNT_THOUSAND_UNIT = 1000;

type Props = {
  commentCount: number;
  isDisliked: boolean;
  isAuthPending: boolean;
  isLikePending: boolean;
  isLiked: boolean;
  likeCount: number;
  onCommentClick: () => void;
  onToggleDislike: () => void;
  onToggleLike: () => void;
  viewCount: number;
};

export function PostDetailPrimaryActions({
  commentCount,
  isDisliked,
  isAuthPending,
  isLikePending,
  isLiked,
  likeCount,
  onCommentClick,
  onToggleDislike,
  onToggleLike,
  viewCount,
}: Props) {
  return (
    <div className="flex shrink-0 items-center gap-1 md:gap-4">
      <div className="bg-muted text-muted-foreground flex h-10 items-center gap-1 rounded-full px-2 text-base font-semibold md:gap-2 md:px-3">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'text-muted-foreground h-8 rounded-full px-2',
            isLiked
              ? 'bg-button-danger-surface/15 text-button-danger-surface hover:bg-button-danger-surface-hover/20'
              : 'hover:bg-muted/80 hover:text-foreground',
          )}
          disabled={isAuthPending || isLikePending}
          onClick={onToggleLike}
        >
          <ThumbsUp className="h-5 w-5" />
        </Button>
        <span className="px-1">{formatPostDetailCount(likeCount)}</span>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'text-muted-foreground h-8 rounded-full px-2',
            isDisliked
              ? 'bg-button-primary-surface/15 text-button-primary-surface hover:bg-button-primary-surface-hover/20'
              : 'hover:bg-muted/80 hover:text-foreground',
          )}
          disabled={isAuthPending || isLikePending}
          onClick={onToggleDislike}
        >
          <ThumbsDown className="h-5 w-5" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground h-10 rounded-full px-2 text-base font-semibold md:px-4"
        onClick={onCommentClick}
      >
        <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
        <span>{formatPostDetailCount(commentCount)}</span>
      </Button>

      <div className="bg-muted text-muted-foreground flex h-10 items-center gap-2 rounded-full px-2 text-base font-semibold md:px-4">
        <Eye className="h-5 w-5 md:h-6 md:w-6" />
        <span>{formatPostDetailCount(viewCount)}</span>
      </div>
    </div>
  );
}

const formatPostDetailCount = (count: number) => {
  if (count >= COUNT_TEN_THOUSAND_UNIT) return `${(count / COUNT_TEN_THOUSAND_UNIT).toFixed(1)}만`;
  if (count >= COUNT_THOUSAND_UNIT) return `${(count / COUNT_THOUSAND_UNIT).toFixed(1)}천`;

  return count.toLocaleString('ko-KR');
};
