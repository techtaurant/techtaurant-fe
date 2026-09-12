import { useIssueTmpPreviewUrlsApi } from '@/shared/api/generated';

const MILLISECONDS_PER_MINUTE = 60 * 1000;
const PREVIEW_URL_REFRESH_INTERVAL = 10 * MILLISECONDS_PER_MINUTE;

type Params = {
  attachmentIds: string[];
};

export const useGetTmpPreviewUrls = ({ attachmentIds }: Params) => {
  return useIssueTmpPreviewUrlsApi(
    { attachmentIds },
    {
      query: {
        enabled: attachmentIds.length > 0,
        refetchInterval: PREVIEW_URL_REFRESH_INTERVAL,
        select: (response) =>
          (response.data ?? []).map(({ attachmentId, presignedUrl }) => ({ attachmentId, presignedUrl })),
      },
    },
  );
};
