import type { Options } from 'markdown-it';
import MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';
import sanitizeHtml from 'sanitize-html';

import type { PostDetailAttachmentPresignedUrlResponse } from '@/shared/api/generated';
import { isUuid } from '@/shared/lib/is-uuid';

export type PostHeading = {
  id: string;
  text: string;
  level: number;
};

const markdown = new MarkdownIt({
  breaks: true,
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
const HEADING_TAGS = ['h1', 'h2', 'h3'];

const slugifyHeadingText = (text: string) => {
  return (
    text
      .toLowerCase()
      .replace(/[_\s]+/g, '-')
      .replace(/[^\p{L}\p{N}-]/gu, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'heading'
  );
};

const readHeadingTexts = (html: string) => {
  const texts: string[] = [];

  sanitizeHtml(html, {
    allowedTags: HEADING_TAGS,
    exclusiveFilter: ({ tag, text }) => {
      if (HEADING_TAGS.includes(tag)) texts.push(text.replace(/\s+/g, ' ').trim());

      return false;
    },
  });

  return texts;
};

const sanitizePostHtml = (renderedHtml: string) => {
  const headingTexts = readHeadingTexts(renderedHtml);
  const headings: PostHeading[] = [];
  const usedIds = new Set<string>();
  let headingIndex = 0;

  const addHeadingId = (tagName: string, attribs: sanitizeHtml.Attributes) => {
    const text = headingTexts[headingIndex++];
    const attributes = { ...attribs };
    delete attributes.id;

    if (!text) return { tagName, attribs: attributes };

    const slug = slugifyHeadingText(text);
    let id = slug;
    let suffix = 2;
    while (usedIds.has(id)) id = `${slug}-${suffix++}`;
    usedIds.add(id);

    headings.push({ id, text, level: Number(tagName.slice(1)) });

    return { tagName, attribs: { ...attributes, id } };
  };

  const html = sanitizeHtml(renderedHtml, {
    allowedAttributes: { '*': ALLOWED_ATTRIBUTES, h1: ['id'], h2: ['id'], h3: ['id'] },
    transformTags: { h1: addHeadingId, h2: addHeadingId, h3: addHeadingId },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedTags: ALLOWED_TAGS,
    allowProtocolRelative: false,
  });

  return { html, headings };
};

/**
 * 신뢰할 수 없는 게시물 마크다운을 안전하게 렌더링할 수 있는 HTML과 목차 데이터로 변환합니다.
 */
export function renderPostMarkdown(
  markdownSource: string,
  attachmentPresignedUrls: PostDetailAttachmentPresignedUrlResponse[],
  highlight?: Options['highlight'],
) {
  const presignedUrlByAttachmentId = new Map(
    attachmentPresignedUrls.map(({ attachmentId, presignedUrl }) => [attachmentId, presignedUrl]),
  );

  // parse와 render는 같은 env를 공유해야 참조 링크 정의가 유지된다.
  const env = {};
  const tokens = markdown.parse(markdownSource, env);

  replaceAttachmentImageSources(tokens, presignedUrlByAttachmentId);

  const renderedHtml = markdown.renderer.render(tokens, { ...markdown.options, highlight }, env);

  return sanitizePostHtml(renderedHtml);
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
    } else if (attachmentId && isUuid(attachmentId)) {
      token.attrSet('src', '');
    }
  }
};
