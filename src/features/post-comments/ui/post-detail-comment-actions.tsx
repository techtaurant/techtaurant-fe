'use client';

import { MoreVertical, Pencil, Trash2, UserX } from 'lucide-react';

import type { CommentItem } from '@/entities/comment';
import { DropdownContent, DropdownItem, DropdownProvider, DropdownTrigger } from '@/shared/ui/dropdown';

type Props = {
  comment: CommentItem;
  isOwnComment: boolean;
  onBlockCommentAuthor: (comment: CommentItem) => void;
  onDeleteComment: (comment: CommentItem) => void;
  onEditComment: () => void;
};

const EDIT_COMMENT_LABEL = '수정';
const DELETE_COMMENT_LABEL = '삭제';
const BLOCK_COMMENT_AUTHOR_LABEL = '차단하기';

export function PostDetailCommentActions({
  comment,
  isOwnComment,
  onBlockCommentAuthor,
  onDeleteComment,
  onEditComment,
}: Props) {
  const handleEditCommentButtonClick = () => {
    onEditComment();
  };

  const handleDeleteCommentButtonClick = () => {
    onDeleteComment(comment);
  };

  const handleBlockCommentAuthorButtonClick = () => {
    onBlockCommentAuthor(comment);
  };

  return (
    <DropdownProvider className="relative shrink-0">
      <DropdownTrigger
        type="button"
        className="text-muted-foreground hover:bg-muted hover:text-foreground h-8 w-8 rounded-full transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </DropdownTrigger>
      <DropdownContent align="end" className="min-w-28 rounded-xl">
        {isOwnComment ? (
          <>
            <DropdownItem onClick={handleEditCommentButtonClick}>
              <Pencil className="h-3.5 w-3.5" />
              {EDIT_COMMENT_LABEL}
            </DropdownItem>
            <DropdownItem
              className="text-button-danger-surface hover:text-button-danger-surface"
              onClick={handleDeleteCommentButtonClick}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {DELETE_COMMENT_LABEL}
            </DropdownItem>
          </>
        ) : (
          <DropdownItem
            className="text-button-danger-surface hover:text-button-danger-surface"
            onClick={handleBlockCommentAuthorButtonClick}
          >
            <UserX className="h-3.5 w-3.5" />
            {BLOCK_COMMENT_AUTHOR_LABEL}
          </DropdownItem>
        )}
      </DropdownContent>
    </DropdownProvider>
  );
}
