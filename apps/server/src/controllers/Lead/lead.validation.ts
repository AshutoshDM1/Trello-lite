import { z } from 'zod';
import { LEAD_STATUSES } from '../../db/schema.js';

export const publicCreateLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  source: z.string().optional().default('website'),
  notes: z.string().optional().nullable(),
});

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  source: z.string().optional().default('dashboard'),
  status: z.enum(LEAD_STATUSES).optional().default('new'),
  notes: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
});

export const updateLeadSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').optional(),
  email: z.string().email('Valid email address is required').optional(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  source: z.string().optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  notes: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
});
