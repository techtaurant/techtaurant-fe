import type { CategoryResponse } from '@/shared/api/generated';

export type CategoryTreeNode = CategoryResponse & {
  children: CategoryTreeNode[];
};

export const toCategoryTree = (categories: CategoryResponse[]): CategoryTreeNode[] => {
  const nodes = new Map<string, CategoryTreeNode>(
    categories.map((category) => [category.id, { ...category, children: [] }]),
  );
  const roots: CategoryTreeNode[] = [];

  for (const node of nodes.values()) {
    const parent = node.parentId ? nodes.get(node.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  return roots;
};
