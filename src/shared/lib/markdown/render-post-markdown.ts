import MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';
import sanitizeHtml from 'sanitize-html';

import type { PostDetailAttachmentPresignedUrlResponse } from '@/shared/api/generated';

const markdown = new MarkdownIt({
  html: true,
  langPrefix: 'language-',
  linkify: true,
});

const ALLOWED_TAGS = [
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'blockquote',
  'br',
  'caption',
  'code',
  'col',
  'colgroup',
  'dd',
  'del',
  'details',
  'dfn',
  'div',
  'dl',
  'dt',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'kbd',
  'li',
  'mark',
  'ol',
  'p',
  'picture',
  'pre',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'small',
  'source',
  'span',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'time',
  'tr',
  'u',
  'ul',
  'var',
  'wbr',
];

const ALLOWED_ATTRIBUTES = [
  'abbr',
  'align',
  'alt',
  'cite',
  'class',
  'colspan',
  'datetime',
  'dir',
  'headers',
  'height',
  'href',
  'loading',
  'media',
  'open',
  'rel',
  'reversed',
  'rowspan',
  'sizes',
  'span',
  'src',
  'srcset',
  'start',
  'target',
  'title',
  'type',
];

const IMAGE_TOKEN_TYPE = 'image';

/**
 * Converts untrusted post markdown to HTML that is safe for the post-detail
 * rendering boundary.
 */
export function renderPostMarkdown(
  markdownSource: string,
  attachmentPresignedUrls: PostDetailAttachmentPresignedUrlResponse[],
): string {
  const presignedUrlByAttachmentId = new Map(
    attachmentPresignedUrls.map(({ attachmentId, presignedUrl }) => [attachmentId, presignedUrl]),
  );

  // parse와 render는 같은 env를 공유해야 참조 링크 정의가 유지된다.
  const env = {};
  const tokens = markdown.parse(markdownSource, env);

  replaceAttachmentImageSources(tokens, presignedUrlByAttachmentId);

  const renderedHtml = markdown.renderer.render(tokens, markdown.options, env);

  return sanitizeHtml(renderedHtml, {
    allowedAttributes: { '*': ALLOWED_ATTRIBUTES },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedTags: ALLOWED_TAGS,
    allowProtocolRelative: false,
  });
}

// 본문은 이미지를 `![alt](attachmentId)`로 참조한다. attachmentId는 URI 형태가 아니라
// ALLOWED_URI를 통과하지 못해 sanitize 단계에서 지워지므로, 그 전에 토큰의 src를 바꾼다.
const replaceAttachmentImageSources = (tokens: Token[], presignedUrlByAttachmentId: Map<string, string>) => {
  for (const token of tokens) {
    if (token.children) {
      replaceAttachmentImageSources(token.children, presignedUrlByAttachmentId);
    }

    if (token.type !== IMAGE_TOKEN_TYPE) continue;

    const attachmentId = token.attrGet('src');
    const presignedUrl = attachmentId && presignedUrlByAttachmentId.get(attachmentId);

    if (presignedUrl) {
      token.attrSet('src', presignedUrl);
    } else if (attachmentId?.match(/^[0-9a-fA-F]{8}(?:-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$/)) {
      token.attrSet('src', '');
    }
  }
};
