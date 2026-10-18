import { IS_SERVER } from '@/shared/config';
import { toast } from '@/shared/ui/toast';

const SHARE_LINK_COPIED_MESSAGE = '링크가 복사되었습니다!';
const SHARE_LINK_COPY_FAILED_MESSAGE = '링크 복사에 실패했습니다.';

export const usePostDetailShare = () => {
  const sharePostDetail = async () => {
    if (IS_SERVER) return;

    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(SHARE_LINK_COPIED_MESSAGE);
    } catch {
      toast.error(SHARE_LINK_COPY_FAILED_MESSAGE);
    }
  };

  return {
    sharePostDetail,
  };
};
