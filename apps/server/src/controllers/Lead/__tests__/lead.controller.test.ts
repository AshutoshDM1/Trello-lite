import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('../../../utils/db.js', () => {
  return {
    default: {
      select: vi.fn(),
      insert: vi.fn(),
    },
  };
});

vi.mock('../../../services/email.service.js', () => ({
  sendLeadConfirmationEmail: vi.fn().mockResolvedValue(undefined),
}));

import { publicCreateLead } from '../lead.controller.js';
import db from '../../../utils/db.js';

describe('Lead Controller & Duplicate Detection (Modular Tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 409 Conflict when duplicate email or phone is submitted', async () => {
    // Mock database check returning existing lead matching conditions
    (db.select as any).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi
            .fn()
            .mockResolvedValue([
              { id: 'lead_existing', email: 'duplicate@client.com', phone: '+1 555-9999' },
            ]),
        }),
      }),
    });

    const req = {
      body: {
        name: 'Duplicate Client',
        email: 'duplicate@client.com',
        phone: '+1 555-9999',
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await publicCreateLead(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('already exists'),
      }),
    );
  });

  it('should successfully capture lead when input is non-duplicate', async () => {
    // Mock database check returning no duplicates
    (db.select as any).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    // Mock database insertion returning new lead
    (db.insert as any).mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            id: 'lead_new_123',
            name: 'New Client',
            email: 'newclient@example.com',
            status: 'new',
          },
        ]),
      }),
    });

    const req = {
      body: {
        name: 'New Client',
        email: 'newclient@example.com',
        source: 'website',
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await publicCreateLead(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Lead captured successfully',
      }),
    );
  });
});
