const ATTACHMENT_ID_PATTERN = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;

export const extractAttachmentIds = (content: string) => {
  return [...new Set(content.match(ATTACHMENT_ID_PATTERN) ?? [])];
};
