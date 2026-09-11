import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'orval';

loadEnvConfig(process.cwd());

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL 환경 변수를 확인해주세요.');
}

export default defineConfig({
  techtaurant: {
    input: {
      target: `${process.env.NEXT_PUBLIC_API_BASE_URL}/v3/api-docs`,
    },
    output: {
      mode: 'single',
      target: './src/shared/api/generated/index.ts',
      httpClient: 'fetch',
      client: 'react-query',
      clean: true,
      baseUrl: {
        runtime: 'process.env.NEXT_PUBLIC_API_BASE_URL',
      },
      override: {
        useTypeOverInterfaces: true,
        operationName: (operation) => `${operation.operationId}Api`,
        fetch: {
          includeHttpResponseReturnType: false,
        },
        mutator: {
          path: './src/shared/api/custom-fetch.ts',
          name: 'customFetch',
        },
        query: {
          useQuery: true,
          usePrefetch: true,
        },
        operations: {
          issueTmpPreviewUrls: {
            query: {
              useQuery: true,
            },
          },
          // infiniteQuery가 필요한 API에 한해서 추가
          getPosts: {
            query: {
              useInfinite: true,
              useInfiniteQueryParam: 'cursor',
            },
          },
          getTags: {
            query: {
              useInfinite: true,
              useInfiniteQueryParam: 'cursor',
            },
          },
          getParentComments: {
            query: {
              useInfinite: true,
              useInfiniteQueryParam: 'cursor',
            },
          },
          getReplies: {
            query: {
              useInfinite: true,
              useInfiniteQueryParam: 'cursor',
            },
          },
        },
      },
    },
    hooks: {
      afterAllFilesWrite: ['eslint --fix --no-warn-ignored', 'prettier --write --ignore-path .prettierignore'],
    },
  },
});
