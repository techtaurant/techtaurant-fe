'use client';

import { useSearchCategories } from '@/entities/category';
import { PostCategoryFilterList } from '@/features/post-list-filter';
import { SidebarDrawer } from '@/shared/ui/sidebar';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  categoryId?: string;
  onChange: (categoryId?: string) => void;
};

export function UserCategorySidebar({ isOpen, onClose, userId, categoryId, onChange }: Props) {
  const { data: categories = [] } = useSearchCategories({ userId, path: '' });

  return (
    <SidebarDrawer isOpen={isOpen} onClose={onClose}>
      {(close) => (
        <PostCategoryFilterList
          categories={categories}
          categoryId={categoryId}
          onChange={(nextCategoryId) => {
            onChange(nextCategoryId);
            close();
          }}
        />
      )}
    </SidebarDrawer>
  );
}
