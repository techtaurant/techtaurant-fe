import { API_BASE_URL, IS_SERVER } from '@/shared/config';

export type CustomFetchInit = RequestInit & {
  cookieHeader?: string;
};

let isRefreshing: Promise<boolean> | null = null;

const createHeaders = (headers: HeadersInit | undefined, cookieHeader: string | undefined) => {
  if (!IS_SERVER || !cookieHeader) {
    return headers;
  }

  const requestHeaders = new Headers(headers);
  requestHeaders.set('Cookie', cookieHeader);
  return requestHeaders;
};

const parseBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return undefined;
  }

  if (response.headers.get('content-type')?.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

export const customFetch = async <T>(url: string, init: CustomFetchInit = {}): Promise<T> => {
  const { cookieHeader, ...fetchInit } = init;
  const requestInit: RequestInit = {
    ...fetchInit,
    credentials: IS_SERVER ? 'omit' : (fetchInit.credentials ?? 'include'),
    headers: createHeaders(fetchInit.headers, cookieHeader),
  };

  let response = await fetch(url, requestInit);

  if (!IS_SERVER && response.status === 401) {
    const bodyStatusCode = await response
      .clone()
      .json()
      .then((body) => body?.status)
      .catch(() => undefined);

    if ([3003, 3008].includes(bodyStatusCode)) {
      if (!isRefreshing) {
        isRefreshing = fetch(`${API_BASE_URL}/open-api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        })
          .then((refreshResponse) => refreshResponse.ok)
          .finally(() => {
            isRefreshing = null;
          });
      }

      if (await isRefreshing) {
        response = await fetch(url, requestInit);
      }
    }
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`, {
      cause: response.status,
    });
  }

  return parseBody(response) as Promise<T>;
};
