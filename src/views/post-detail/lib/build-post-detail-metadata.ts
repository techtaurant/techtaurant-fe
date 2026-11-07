import type { Metadata, ResolvedMetadata } from 'next';

import type { PostDetailResponse } from '@/shared/api/generated';
import { DEFAULT_SHARE_IMAGE_URL } from '@/shared/config';
import { extractPostPlainText } from '@/shared/lib/markdown/extract-post-plain-text';
import { truncateAtSentenceBoundary } from '@/shared/lib/truncate-at-sentence-boundary';

const DESCRIPTION_LENGTH_RANGE = { maxLength: 120, minLength: 80 };

const HIDDEN_POST_METADATA: Metadata = {
  title: '게시물',
  robots: { index: false, follow: false },
};

const selectShareImageUrl = ({ attachmentPresignedUrls, thumbnailAttachmentId }: PostDetailResponse) => {
  const thumbnail = attachmentPresignedUrls.find((attachment) => attachment.attachmentId === thumbnailAttachmentId);
  const firstAttachment = attachmentPresignedUrls[0];

  return thumbnail?.presignedUrl ?? firstAttachment?.presignedUrl ?? DEFAULT_SHARE_IMAGE_URL;
};

export const buildPostDetailMetadata = (
  post: PostDetailResponse | undefined,
  parentOpenGraph: ResolvedMetadata['openGraph'],
): Metadata => {
  if (post?.status !== 'PUBLISHED') {
    return HIDDEN_POST_METADATA;
  }

  const description = truncateAtSentenceBoundary(extractPostPlainText(post.content), DESCRIPTION_LENGTH_RANGE);
  const canonicalPath = `/posts/${post.id}`;

  return {
    title: post.title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      ...parentOpenGraph,
      type: 'article',
      title: post.title,
      description,
      url: canonicalPath,
      images: [selectShareImageUrl(post)],
    },
  };
};
