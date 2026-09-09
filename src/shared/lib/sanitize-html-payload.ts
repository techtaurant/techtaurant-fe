import DOMPurify from 'isomorphic-dompurify';

export const sanitizeHtmlPayload = (payloadHtml: string) => {
  return DOMPurify.sanitize(payloadHtml, { ALLOWED_ATTR: [], ALLOWED_TAGS: [] }).trim();
};
