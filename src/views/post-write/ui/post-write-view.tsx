'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useGetMe } from '@/entities/user';
import { startGoogleLogin } from '@/features/auth';
import { cn } from '@/shared/lib/cn';
import { usePostAttachmentPreviews } from '@/views/post-write/model/use-post-attachment-previews';
import { usePostImageUpload } from '@/views/post-write/model/use-post-image-upload';
import { usePostWriteForm } from '@/views/post-write/model/use-post-write-form';
import { PostWriteActions } from '@/views/post-write/ui/post-write-actions';
import { PostWriteCategoryField } from '@/views/post-write/ui/post-write-category-field';
import { PostWriteImageButton } from '@/views/post-write/ui/post-write-image-button';
import { PostWritePreview } from '@/views/post-write/ui/post-write-preview';
import { PostWriteTagField } from '@/views/post-write/ui/post-write-tag-field';

const TITLE_MAX_LENGTH = 200;

export function PostWriteView() {
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const { data: me, isPending: isAuthPending } = useGetMe();
  const {
    categoryPath,
    content,
    handleCategoryPathChange,
    handleContentChange,
    handleDraftSaveClick,
    handleTagsChange,
    handleTitleChange,
    isDraftSaving,
    tags,
    title,
  } = usePostWriteForm();

  const { attachmentPreviewUrls } = usePostAttachmentPreviews({ content });
  const { handleImageSelect, isUploading } = usePostImageUpload({
    content,
    contentRef,
    onContentChange: handleContentChange,
  });

  const isLoggedIn = !!me;

  const handleExitClick = () => {
    router.push('/');
  };

  useEffect(() => {
    if (isAuthPending || isLoggedIn) return;

    startGoogleLogin();
  }, [isAuthPending, isLoggedIn]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={cn('grid h-dvh min-w-90 grid-cols-1 grid-rows-[minmax(0,1fr)_auto]', 'xl:grid-cols-2')}>
      {/* xl 미만에서는 작성창과 미리보기가 한 스크롤 영역에 이어지고, xl 이상에서는 contents로 풀려 각각 독립 컬럼이 됩니다. */}
      <div className={cn('min-h-0 overflow-y-auto', 'xl:contents')}>
        <div
          className={cn(
            'bg-background min-w-0 px-8 pt-8 pb-16',
            'xl:col-start-1 xl:row-start-1 xl:min-h-0 xl:overflow-y-auto',
          )}
        >
          <input
            className={cn(
              'text-foreground w-full border-0 bg-transparent px-0 py-0 text-3xl font-semibold tracking-tight transition-colors duration-200',
              'placeholder:text-muted-foreground focus:outline-none',
            )}
            maxLength={TITLE_MAX_LENGTH}
            onChange={(event) => handleTitleChange(event.target.value)}
            placeholder="제목을 입력해주세요"
            type="text"
            value={title}
          />

          <div className="bg-foreground/80 mt-4 h-1.5 w-16" />

          <div className="mt-6 flex flex-col gap-5">
            <PostWriteCategoryField categoryPath={categoryPath} onCategoryPathChange={handleCategoryPathChange} />
            <PostWriteTagField onTagsChange={handleTagsChange} tags={tags} />
            <div className="flex flex-wrap items-center gap-3">
              <PostWriteImageButton isUploading={isUploading} onImageSelect={handleImageSelect} />
            </div>
          </div>

          <textarea
            ref={contentRef}
            className={cn(
              'text-foreground mt-6 field-sizing-content min-h-100 w-full resize-none overflow-hidden border-0 bg-transparent px-0 pt-2 font-mono text-base leading-8',
              'placeholder:text-muted-foreground focus:outline-none',
            )}
            onChange={(event) => handleContentChange(event.target.value)}
            placeholder="내용을 입력해주세요"
            value={content}
          />
        </div>

        {/* xl 이상에서는 하단바 행까지 걸쳐 오른쪽 전체를 미리보기가 차지합니다. */}
        <div
          className={cn(
            'bg-post-write-preview-surface min-h-[50dvh] min-w-0 px-8 pt-8 pb-16',
            'xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:min-h-0 xl:overflow-y-auto',
          )}
        >
          <PostWritePreview attachmentPresignedUrls={attachmentPreviewUrls} content={content} />
        </div>
      </div>

      <div
        className={cn(
          'border-border bg-background shadow-floating-top min-w-0 border-t px-8 py-3',
          'xl:col-start-1 xl:row-start-2',
        )}
      >
        <PostWriteActions
          isDraftSaving={isDraftSaving}
          onDraftSaveClick={handleDraftSaveClick}
          onExitClick={handleExitClick}
        />
      </div>
    </div>
  );
}
