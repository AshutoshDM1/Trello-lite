import { describe, it, expect } from 'vitest';
import { publicCreateLeadSchema, createLeadSchema, updateLeadSchema } from '../lead.validation.js';

describe('Lead Validation Schemas (Unit Tests)', () => {
  describe('publicCreateLeadSchema', () => {
    it('should validate a valid public lead input', () => {
      const payload = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 555-0199',
        company: 'Acme Corp',
        source: 'website',
        notes: 'Interested in enterprise plan',
      };

      const result = publicCreateLeadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('john@example.com');
      }
    });

    it('should fail when name or email is missing', () => {
      const payload = {
        email: 'john@example.com',
      };

      const result = publicCreateLeadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should fail when email format is invalid', () => {
      const payload = {
        name: 'John Doe',
        email: 'invalid-email-address',
      };

      const result = publicCreateLeadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('createLeadSchema', () => {
    it('should validate dashboard lead creation payload', () => {
      const payload = {
        name: 'Jane Smith',
        email: 'jane@company.com',
        status: 'qualified',
        source: 'referral',
      };

      const result = createLeadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('qualified');
      }
    });

    it('should fail on invalid lead status string', () => {
      const payload = {
        name: 'Jane Smith',
        email: 'jane@company.com',
        status: 'non_existent_status',
      };

      const result = createLeadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('updateLeadSchema', () => {
    it('should allow partial updates for lead status and notes', () => {
      const payload = {
        status: 'won',
        notes: 'Closed deal contract signed.',
      };

      const result = updateLeadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('won');
      }
    });
  });
});
