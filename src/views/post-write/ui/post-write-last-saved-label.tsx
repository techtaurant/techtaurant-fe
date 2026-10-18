'use client';

import { useEffect, useState } from 'react';

import { formatDisplayTime } from '@/shared/lib/format-date';

const LABEL_REFRESH_INTERVAL_MS = 60_000;

type Props = {
  lastSavedAt: string;
};

export function PostWriteLastSavedLabel({ lastSavedAt }: Props) {
  const [, setRefreshTick] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => setRefreshTick((tick) => tick + 1), LABEL_REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  return <span className="text-muted-foreground shrink-0 text-xs">{formatDisplayTime(lastSavedAt)} 저장됨</span>;
}
