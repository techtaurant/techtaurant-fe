'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useGetPostDetail } from '@/entities/post-detail';
import { startGoogleLogin } from '@/features/auth';
import { PostDetailCommentsSection } from '@/features/post-comments';
import { PostDetailActionBar } from '@/features/post-detail-interactions';
import { PostContent } from '@/shared/ui/post-content';
import { useRecordPostViewOnce } from '@/views/post-detail/model/use-record-post-view-once';
import { PostDetailArticleHeader } from '@/views/post-detail/ui/post-detail-article-header';
import { PostDetailContainer } from '@/views/post-detail/ui/post-detail-container';

type Props = {
  postId: string;
};

export function PostDetailView({ postId }: Props) {
  const commentsRef = useRef<HTMLElement>(null);
  const [commentFocusRequestKey, setCommentFocusRequestKey] = useState(0);
  const [isCommentsLoaded, setIsCommentsLoaded] = useState(false);
  const { data: post } = useGetPostDetail(postId);

  const target = useSearchParams().get('target');

  useRecordPostViewOnce({
    enabled: Boolean(post),
    postId,
  });

  useEffect(() => {
    if (!isCommentsLoaded || target !== 'comment') return;

    const frameId = requestAnimationFrame(() => {
      commentsRef.current?.scrollIntoView({ block: 'start' });
    });

    return () => cancelAnimationFrame(frameId);
  }, [isCommentsLoaded, postId, target]);

  const handleCommentsLoaded = useCallback(() => {
    setIsCommentsLoaded(true);
  }, []);

  const handleCommentButtonClick = () => {
    setCommentFocusRequestKey((currentKey) => currentKey + 1);
  };

  if (!post) {
    return null;
  }

  const authorId = post.author.id;

  return (
    <PostDetailContainer>
      <article>
        <PostDetailArticleHeader
          authorId={authorId}
          authorName={post.author.name}
          categoryName={post.category?.name}
          createdAt={post.createdAt}
          postId={postId}
          profileImageUrl={post.author.profileImageUrl}
          status={post.status}
          tags={post.tags}
          title={post.title}
          updatedAt={post.updatedAt}
        />
        <PostContent attachmentPresignedUrls={post.attachmentPresignedUrls} className="mb-12" content={post.content} />
        <PostDetailActionBar
          authorId={authorId}
          commentCount={post.commentCount}
          isRead={post.isRead}
          likeCount={post.likeCount}
          likeStatus={post.likeStatus}
          onRequireLogin={startGoogleLogin}
          viewCount={post.viewCount}
          onCommentClick={handleCommentButtonClick}
          postId={postId}
        />
        <PostDetailCommentsSection
          ref={commentsRef}
          commentCount={post.commentCount}
          focusRequestKey={commentFocusRequestKey}
          onCommentsLoaded={handleCommentsLoaded}
          onRequireLogin={startGoogleLogin}
          postAuthorId={authorId}
          postId={postId}
        />
      </article>
    </PostDetailContainer>
  );
}
