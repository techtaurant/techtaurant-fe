import type { QueryClient } from '@tanstack/react-query';

import { fetchPostDetail } from '@/entities/post-detail/api/use-get-post-detail';

const createQueryClientMock = () => {
  const fetchQuery = jest.fn();
  const queryClient = { fetchQuery } as unknown as QueryClient;

  return { fetchQuery, queryClient };
};

describe('fetchPostDetail', () => {
  it('조회에 성공하면 정상적으로 종료한다', async () => {
    const { fetchQuery, queryClient } = createQueryClientMock();
    fetchQuery.mockResolvedValue({});

    await expect(fetchPostDetail(queryClient, { postId: 'post-id' })).resolves.toBeUndefined();
  });

  it('401 오류는 무시한다', async () => {
    const { fetchQuery, queryClient } = createQueryClientMock();
    fetchQuery.mockRejectedValue(new Error('Unauthorized', { cause: 401 }));

    await expect(fetchPostDetail(queryClient, { postId: 'post-id' })).resolves.toBeUndefined();
  });

  it.each([404, 500])('%i 오류는 다시 던진다', async (status) => {
    const { fetchQuery, queryClient } = createQueryClientMock();
    const error = new Error('API Error', { cause: status });
    fetchQuery.mockRejectedValue(error);

    await expect(fetchPostDetail(queryClient, { postId: 'post-id' })).rejects.toBe(error);
  });
});
