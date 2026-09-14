import DOMPurify from 'isomorphic-dompurify';

export const sanitizeNotificationPayload = (payloadHtml: string) => {
  return DOMPurify.sanitize(payloadHtml, { ALLOWED_ATTR: [], ALLOWED_TAGS: ['strong'] });
};
