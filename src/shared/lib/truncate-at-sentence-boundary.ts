type LengthRange = {
  maxLength: number;
  minLength: number;
};

const ELLIPSIS = '…';
const SENTENCE_END_BEFORE_SPACE = /[.!?](?=\s)/g;

const findLastSentenceEndLength = (text: string) => {
  const sentenceEnds = [...text.matchAll(SENTENCE_END_BEFORE_SPACE)];
  const lastSentenceEnd = sentenceEnds.at(-1);

  return lastSentenceEnd ? lastSentenceEnd.index + 1 : 0;
};

export const truncateAtSentenceBoundary = (text: string, { maxLength, minLength }: LengthRange) => {
  if (text.length <= maxLength) {
    return text;
  }

  // 경계에 딱 걸친 문장 끝과 공백을 놓치지 않도록 한 글자 더 본다.
  const boundaryWindow = text.slice(0, maxLength + 1);
  const sentenceEndLength = findLastSentenceEndLength(boundaryWindow);

  if (sentenceEndLength >= minLength) {
    return text.slice(0, sentenceEndLength);
  }

  const lastSpaceIndex = boundaryWindow.lastIndexOf(' ');
  const cutLength = lastSpaceIndex > 0 ? lastSpaceIndex : maxLength;

  return `${text.slice(0, cutLength).trimEnd()}${ELLIPSIS}`;
};
