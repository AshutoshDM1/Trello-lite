import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth-schema.js';

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'proposal_sent',
  'won',
  'lost',
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const lead = pgTable('lead', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  company: text('company'),
  source: text('source').default('website').notNull(),
  status: text('status').default('new').notNull(),
  notes: text('notes'),
  assignedTo: text('assigned_to').references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const leadNote = pgTable('lead_note', {
  id: text('id').primaryKey(),
  leadId: text('lead_id')
    .notNull()
    .references(() => lead.id, { onDelete: 'cascade' }),
  authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }),
  content: text('content').notNull(),
  type: text('type').default('note').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
