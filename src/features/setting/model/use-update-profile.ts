'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadAttachment } from '@/entities/attachment';
import { getMeQueryKey, getUserProfileImageQueryKey, updateMe } from '@/entities/user';
import { PresignedUrlRequestReferenceType } from '@/shared/api/generated';

type Params = {
  name: string;
  imageFile: File | null;
};

const updateProfile = async ({ name, imageFile }: Params) => {
  const uploaded = await uploadAttachment({ file: imageFile, referenceType: PresignedUrlRequestReferenceType.USER });

  return updateMe({
    name,
    serviceProfileImageAttachmentId: uploaded?.attachmentId,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async (user) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getMeQueryKey() }),
        ...(user ? [queryClient.invalidateQueries({ queryKey: getUserProfileImageQueryKey(user.id) })] : []),
      ]);
    },
  });
};
