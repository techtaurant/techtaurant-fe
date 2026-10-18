'use client';

import type { RefObject } from 'react';

import { usePostAttachmentUpload } from '@/views/post-write/model/use-post-attachment-upload';

const buildImageMarkdown = (fileName: string, attachmentId: string) => {
  return `![${fileName}](${attachmentId})`;
};

const insertAtCursor = (content: string, insertion: string, selectionStart: number, selectionEnd: number) => {
  const before = content.slice(0, selectionStart);
  const after = content.slice(selectionEnd);
  const leadingBreak = before && !before.endsWith('\n') ? '\n' : '';

  return `${before}${leadingBreak}${insertion}\n${after}`;
};

type Params = {
  content: string;
  contentRef: RefObject<HTMLTextAreaElement | null>;
  onContentChange: (content: string) => void;
};

export const usePostImageUpload = ({ content, contentRef, onContentChange }: Params) => {
  const { isUploading, uploadImage } = usePostAttachmentUpload();

  const handleImageSelect = (file: File) => {
    const { selectionEnd, selectionStart } = contentRef.current ?? {
      selectionEnd: content.length,
      selectionStart: content.length,
    };

    uploadImage(file, (attachmentId) => {
      const imageMarkdown = buildImageMarkdown(file.name, attachmentId);
      onContentChange(insertAtCursor(content, imageMarkdown, selectionStart, selectionEnd));
    });
  };

  return { handleImageSelect, isUploading };
};
