import { useBanUserApi } from '@/shared/api/generated';

export const useBanUser = (options?: Parameters<typeof useBanUserApi>[0]) => {
  return useBanUserApi(options);
};
