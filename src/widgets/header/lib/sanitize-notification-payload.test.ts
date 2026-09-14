import mockDOMPurify from 'dompurify';

import { sanitizeNotificationPayload } from '@/widgets/header/lib/sanitize-notification-payload';

jest.mock('isomorphic-dompurify', () => ({
  __esModule: true,
  default: mockDOMPurify,
}));

describe('sanitizeNotificationPayload', () => {
  it('strong만 남기고 실행 가능한 HTML을 제거한다', () => {
    expect(sanitizeNotificationPayload('<strong>압록희</strong><img src=x onerror=alert(1)>')).toBe(
      '<strong>압록희</strong>',
    );
  });
});
