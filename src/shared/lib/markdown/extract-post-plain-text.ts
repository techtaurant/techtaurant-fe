import MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';

const markdown = new MarkdownIt({ html: true });

const TEXT_TOKEN_TYPES = new Set(['text', 'text_special', 'code_inline', 'fence', 'code_block']);
const IMAGE_TOKEN_TYPE = 'image';
const LINE_BREAK_TOKEN_TYPES = new Set(['softbreak', 'hardbreak']);
const BOUNDARY_SPACE = ' ';

export const extractPostPlainText = (markdownSource: string) => {
  const tokens = markdown.parse(markdownSource, {});
  const textFragments: string[] = [];

  collectTextFragments(tokens, textFragments);

  return textFragments.join('').replace(/\s+/g, ' ').trim();
};

const collectTextFragments = (tokens: Token[], textFragments: string[]) => {
  for (const token of tokens) {
    if (token.type === IMAGE_TOKEN_TYPE) continue;

    if (TEXT_TOKEN_TYPES.has(token.type)) {
      textFragments.push(token.content);
    }

    if (token.children) {
      collectTextFragments(token.children, textFragments);
    }

    if (token.block || LINE_BREAK_TOKEN_TYPES.has(token.type)) {
      textFragments.push(BOUNDARY_SPACE);
    }
  }
};
