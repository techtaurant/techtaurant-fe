import mockDOMPurify from 'dompurify';

import { sanitizeHtmlPayload } from '@/shared/lib/sanitize-html-payload';

jest.mock('isomorphic-dompurify', () => ({
  __esModule: true,
  default: mockDOMPurify,
}));

describe('sanitizeHtmlPayload', () => {
  it('HTML payload를 안전한 텍스트로 바꾼다', () => {
    expect(sanitizeHtmlPayload('<strong>새 댓글</strong><script>alert(1)</script>')).toBe('새 댓글');
  });
});
