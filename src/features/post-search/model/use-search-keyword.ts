'use client';

import { useSearchParams } from 'next/navigation';

export const useSearchKeyword = () => {
  const searchParams = useSearchParams();

  return (searchParams.get('query') ?? '').trim();
};
