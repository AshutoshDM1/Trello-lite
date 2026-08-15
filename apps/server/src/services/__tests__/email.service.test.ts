import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendMock = vi.fn();

vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: sendMock,
      },
    })),
  };
});

import { sendLeadConfirmationEmail, SENDER_EMAIL } from '../email.service.js';

describe('Email Service (Resend Integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API = 're_test_key_12345';
  });

  it('should send lead confirmation email with correct parameters', async () => {
    sendMock.mockResolvedValueOnce({
      data: { id: 'email_test_123' },
      error: null,
    });

    await sendLeadConfirmationEmail({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 555-0199',
      company: 'Acme Corp',
      source: 'website',
    });

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: SENDER_EMAIL,
        to: ['john.doe@example.com'],
        subject: expect.stringContaining('Lead-ERP'),
        html: expect.stringContaining('John Doe'),
        text: expect.stringContaining('Acme Corp'),
      }),
    );
  });
});
