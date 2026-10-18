import sanitizeHtml from 'sanitize-html';

import type { PostDetailAttachmentPresignedUrlResponse } from '@/shared/api/generated';
import { renderPostMarkdown } from '@/shared/lib/markdown/render-post-markdown';

const BLOCK_BOUNDARY_TAGS = new Set([
  'blockquote',
  'br',
  'caption',
  'dd',
  'details',
  'div',
  'dl',
  'dt',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'li',
  'ol',
  'p',
  'pre',
  'summary',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'ul',
]);

const BOUNDARY_SPACE = ' ';
const NO_ATTACHMENT_PRESIGNED_URLS: PostDetailAttachmentPresignedUrlResponse[] = [];

export const extractPostPlainText = (markdownSource: string) => {
  const html = renderPostMarkdown(markdownSource, NO_ATTACHMENT_PRESIGNED_URLS);
  let hasPendingBoundary = false;

  const markBlockBoundary = (tagName: string) => {
    if (BLOCK_BOUNDARY_TAGS.has(tagName)) hasPendingBoundary = true;
  };

  const plainText = sanitizeHtml(html, {
    allowedAttributes: {},
    allowedTags: [],
    onCloseTag: markBlockBoundary,
    onOpenTag: markBlockBoundary,
    textFilter: (text) => {
      const boundarySpace = hasPendingBoundary ? BOUNDARY_SPACE : '';
      hasPendingBoundary = false;

      return `${boundarySpace}${text}`;
    },
  });

  return plainText.replace(/\s+/g, ' ').trim();
};
