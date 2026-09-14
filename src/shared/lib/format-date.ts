const MILLISECONDS_PER_MINUTE = 60_000;
const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;
const RELATIVE_DAY_THRESHOLD_MS = 7 * MILLISECONDS_PER_DAY;

export const formatDisplayTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Math.max(0, Date.now() - date.getTime());

  if (diffMs < MILLISECONDS_PER_MINUTE) return '방금 전';
  if (diffMs < MILLISECONDS_PER_HOUR) return `${Math.floor(diffMs / MILLISECONDS_PER_MINUTE)}분 전`;
  if (diffMs < MILLISECONDS_PER_DAY) return `${Math.floor(diffMs / MILLISECONDS_PER_HOUR)}시간 전`;
  if (diffMs < 2 * MILLISECONDS_PER_DAY) return '어제';

  if (diffMs < RELATIVE_DAY_THRESHOLD_MS) {
    return `${Math.floor(diffMs / MILLISECONDS_PER_DAY)}일 전`;
  }

  return formatDateToYmd(date);
};

export const formatAbsoluteDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return formatDateToYmd(date);
};

const formatDateToYmd = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};
