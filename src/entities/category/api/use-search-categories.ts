import { useQuery } from '@tanstack/react-query';

import { getSearchCategoriesApiQueryKey, searchCategoriesApi } from '@/shared/api/generated';

type Params = {
  enabled?: boolean;
  path: string;
  userId?: string;
};

export const useSearchCategories = ({ enabled = true, path, userId = '' }: Params) => {
  return useQuery({
    queryKey: getSearchCategoriesApiQueryKey(userId, { path }),
    queryFn: () => searchCategoriesApi(userId, { path }),
    enabled: enabled && !!userId,
    select: (response) => response.data ?? [],
  });
};
