import { truncateAtSentenceBoundary } from '@/shared/lib/truncate-at-sentence-boundary';

const LENGTH_RANGE = { maxLength: 20, minLength: 10 };

describe('truncateAtSentenceBoundary', () => {
  it('최대 길이와 같으면 그대로 돌려준다', () => {
    const text = '가'.repeat(LENGTH_RANGE.maxLength);

    expect(truncateAtSentenceBoundary(text, LENGTH_RANGE)).toBe(text);
  });

  it('최소와 최대 길이 사이에 문장 끝이 있으면 그 문장 끝에서 자른다', () => {
    const text = '첫 문장은 여기까지. 두 번째 문장은 길게 이어집니다.';

    expect(truncateAtSentenceBoundary(text, LENGTH_RANGE)).toBe('첫 문장은 여기까지.');
  });

  it('문장 끝이 최소 길이보다 앞에만 있으면 최대 길이 안 마지막 공백에서 자르고 줄임표를 붙인다', () => {
    const text = '짧다. 그리고 공백으로 이어지는 긴 문장이 계속됩니다';

    expect(truncateAtSentenceBoundary(text, LENGTH_RANGE)).toBe('짧다. 그리고 공백으로 이어지는 긴…');
  });

  it('공백이 없으면 최대 길이에서 자르고 줄임표를 붙인다', () => {
    const text = 'a'.repeat(LENGTH_RANGE.maxLength + 10);

    expect(truncateAtSentenceBoundary(text, LENGTH_RANGE)).toBe(`${'a'.repeat(LENGTH_RANGE.maxLength)}…`);
  });
});
