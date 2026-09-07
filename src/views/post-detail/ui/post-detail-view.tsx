'use client';

import { useState } from 'react';

import { useGetPostDetail } from '@/entities/post-detail';
import { startGoogleLogin } from '@/features/auth';
import { PostDetailCommentsSection } from '@/features/post-comments';
import { PostDetailActionBar } from '@/features/post-detail-interactions';
import { useRecordPostViewOnce } from '@/views/post-detail/model/use-record-post-view-once';
import { PostDetailArticleHeader } from '@/views/post-detail/ui/post-detail-article-header';
import { PostDetailContainer } from '@/views/post-detail/ui/post-detail-container';
import { PostDetailContent } from '@/views/post-detail/ui/post-detail-content';

type Props = {
  postId: string;
};

export function PostDetailView({ postId }: Props) {
  const [commentFocusRequestKey, setCommentFocusRequestKey] = useState(0);
  const { data: post } = useGetPostDetail(postId);

  useRecordPostViewOnce({
    enabled: Boolean(post),
    postId,
  });

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
          tags={post.tags}
          title={post.title}
          updatedAt={post.updatedAt}
        />
        <PostDetailContent attachmentPresignedUrls={post.attachmentPresignedUrls} content={post.content} />
        <PostDetailActionBar
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
          commentCount={post.commentCount}
          focusRequestKey={commentFocusRequestKey}
          onRequireLogin={startGoogleLogin}
          postAuthorId={authorId}
          postId={postId}
        />
      </article>
    </PostDetailContainer>
  );
}
