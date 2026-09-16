import Link from 'next/link';

import { PostPreview, PostStatList, PostTagList, PostThumbnail } from '@/entities/post-list';
import { UserAvatar } from '@/entities/user';
import type { PostListItemResponse } from '@/shared/api/generated';
import { PostListItemResponseStatus } from '@/shared/api/generated';
import { cn } from '@/shared/lib/cn';
import { formatDisplayTime } from '@/shared/lib/format-date';
import { Badge } from '@/shared/ui/badge';

type Props = {
  post: PostListItemResponse;
};

const PRIVATE_BADGE_LABEL = '비공개';

// TODO: 작성자 클릭, 게시물 클릭 시 읽음 처리, 태그 클릭 구현 필요
export function PostCard({ post }: Props) {
  const thumbnailUrl = post.thumbnailUrl?.trim();
  const isPrivate = post.status === PostListItemResponseStatus.PRIVATE;

  return (
    <article
      className={cn(
        'group border-border cursor-pointer border-b py-4 transition-colors',
        'md:py-6',
        post.isRead && 'opacity-75',
      )}
    >
      <Link
        href={`/posts/${post.id}`}
        className={cn('flex flex-col-reverse items-start gap-3 wrap-anywhere', 'md:flex-row md:gap-6')}
      >
        <div className="min-w-0 flex-1">
          <div className={cn('mb-2 flex flex-wrap items-center gap-2', 'md:mb-3')}>
            <UserAvatar name={post.authorName} profileImageUrl={post.authorProfileImageUrl} className="h-5 w-5" />
            <p className={cn('text-sm font-medium', 'hover:underline')}>{post.authorName}</p>
            <span>·</span>
            <time className="text-muted-foreground text-xs" dateTime={post.updatedAt}>
              {formatDisplayTime(post.updatedAt)}
            </time>
            {isPrivate && <Badge>{PRIVATE_BADGE_LABEL}</Badge>}
          </div>
          <PostPreview title={post.title} content={post.content} />
          <div className={cn('flex flex-wrap items-center gap-3', 'md:gap-4')}>
            <PostTagList tags={post.tags} />
            <PostStatList viewCount={post.viewCount} likeCount={post.likeCount} commentCount={post.commentCount} />
          </div>
        </div>
        {thumbnailUrl && <PostThumbnail src={thumbnailUrl} alt={post.title} />}
      </Link>
    </article>
  );
}
