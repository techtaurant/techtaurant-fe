import { useSearchCategoriesApi } from '@/shared/api/generated';

type Params = {
  enabled?: boolean;
  path: string;
  userId?: string;
};

export const useSearchCategories = ({ enabled = true, path, userId = '' }: Params) => {
  return useSearchCategoriesApi(
    userId,
    { path },
    {
      query: {
        enabled: enabled && !!userId,
        select: (response) => response.data ?? [],
      },
    },
  );
};
