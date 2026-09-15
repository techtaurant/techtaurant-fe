import sanitizeHtml from 'sanitize-html';

export const sanitizeNotificationPayload = (payloadHtml: string) => {
  return sanitizeHtml(payloadHtml, { allowedAttributes: {}, allowedTags: ['strong'] });
};
