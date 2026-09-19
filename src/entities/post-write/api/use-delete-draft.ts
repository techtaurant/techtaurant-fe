import { useDeletePostApi } from '@/shared/api/generated';

export const useDeleteDraft = () => {
  return useDeletePostApi();
};
