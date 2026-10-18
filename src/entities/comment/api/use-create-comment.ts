import type { ApiResponseCommentResponse, CreateCommentRequest } from '@/shared/api/generated';
import { useCreateCommentApi } from '@/shared/api/generated';

type Params = {
  onSuccess?: (request: CreateCommentRequest, response: ApiResponseCommentResponse) => Promise<void> | void;
};

export const useCreateComment = ({ onSuccess }: Params = {}) => {
  return useCreateCommentApi({
    mutation: {
      onSuccess: (response, variables) => {
        return onSuccess?.(variables.data, response);
      },
    },
  });
};
