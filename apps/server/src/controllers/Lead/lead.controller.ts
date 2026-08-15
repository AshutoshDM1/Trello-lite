import type { Request, Response } from 'express';
import { eq, desc, and, or, ilike, count } from 'drizzle-orm';
import crypto from 'crypto';
import asyncHandler from '../../utils/asyncHandler.js';
import db from '../../utils/db.js';
import { lead, leadNote, LEAD_STATUSES } from '../../db/schema.js';
import { user } from '../../db/auth-schema.js';
import { auth } from '../../lib/auth.js';
import { publicCreateLeadSchema, createLeadSchema, updateLeadSchema } from './lead.validation.js';
import { sendLeadConfirmationEmail } from '../../services/email.service.js';

// Public endpoint for prospective leads to submit inquiries (no auth required)
export const publicCreateLead = asyncHandler(async (req: Request, res: Response) => {
  const parseResult = publicCreateLeadSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      message: parseResult.error.issues[0]?.message || 'Validation error',
      errors: parseResult.error.issues,
    });
    return;
  }

  const { name, email, phone, company, source, notes } = parseResult.data;

  // Check for duplicate lead by email or phone
  const dupConditions = [eq(lead.email, email.trim().toLowerCase())];
  if (phone && String(phone).trim()) {
    dupConditions.push(eq(lead.phone, String(phone).trim()));
  }
  const existingDup = await db
    .select()
    .from(lead)
    .where(or(...dupConditions))
    .limit(1);

  if (existingDup.length > 0) {
    res.status(409).json({
      message: 'A lead with this email or phone number already exists in our records.',
    });
    return;
  }

  const newLeadId = `lead_${crypto.randomUUID()}`;

  const createdLeads = await db
    .insert(lead)
    .values({
      id: newLeadId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? String(phone).trim() : null,
      company: company ? String(company).trim() : null,
      source: source ? String(source).trim() : 'website',
      status: 'new',
      notes: notes ? String(notes).trim() : null,
    })
    .returning();

  // Create initial creation activity log
  await db.insert(leadNote).values({
    id: `note_${crypto.randomUUID()}`,
    leadId: newLeadId,
    authorId: null,
    content: `Lead captured via ${source || 'website'} form`,
    type: 'creation',
  });

  if (notes && notes.trim()) {
    await db.insert(leadNote).values({
      id: `note_${crypto.randomUUID()}`,
      leadId: newLeadId,
      authorId: null,
      content: `Initial Notes: ${notes.trim()}`,
      type: 'note',
    });
  }

  // Trigger non-blocking email notification to the lead via Resend
  sendLeadConfirmationEmail({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? String(phone).trim() : null,
    company: company ? String(company).trim() : null,
    source: source ? String(source).trim() : 'website',
    notes: notes ? String(notes).trim() : null,
  }).catch((err) =>
    console.error('[LeadController] Error sending public lead email notification:', err),
  );

  res.status(201).json({
    message: 'Lead captured successfully',
    lead: createdLeads[0],
  });
});

// Authenticated endpoint to fetch leads with server-side pagination, search, and filter
export const getAllLeads = asyncHandler(async (req: Request, res: Response) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { status, search, page = '1', limit = '10' } = req.query;

  const conditions = [];

  if (status && typeof status === 'string' && LEAD_STATUSES.includes(status as any)) {
    conditions.push(eq(lead.status, status));
  }

  if (search && typeof search === 'string' && search.trim()) {
    const searchTerm = `%${search.trim().toLowerCase()}%`;
    conditions.push(
      or(
        ilike(lead.name, searchTerm),
        ilike(lead.email, searchTerm),
        ilike(lead.company, searchTerm),
        ilike(lead.source, searchTerm),
      ),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Calculate total matching count
  const countResult = await db.select({ total: count() }).from(lead).where(whereClause);

  const total = Number(countResult[0]?.total || 0);
  const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
  const limitNum = Math.max(1, parseInt(String(limit), 10) || 10);
  const offset = (pageNum - 1) * limitNum;
  const totalPages = Math.ceil(total / limitNum) || 1;

  const leadsList = await db
    .select({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: lead.source,
      status: lead.status,
      notes: lead.notes,
      assignedTo: lead.assignedTo,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
      assignedUser: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    })
    .from(lead)
    .leftJoin(user, eq(lead.assignedTo, user.id))
    .where(whereClause)
    .orderBy(desc(lead.createdAt))
    .limit(limitNum)
    .offset(offset);

  res.status(200).json({
    data: leadsList,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    },
  });
});

// Authenticated endpoint to create lead from dashboard
export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const parseResult = createLeadSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      message: parseResult.error.issues[0]?.message || 'Validation error',
      errors: parseResult.error.issues,
    });
    return;
  }

  const { name, email, phone, company, source, status, notes, assignedTo } = parseResult.data;

  // Check for duplicate lead by email or phone
  const dupConditions = [eq(lead.email, email.trim().toLowerCase())];
  if (phone && String(phone).trim()) {
    dupConditions.push(eq(lead.phone, String(phone).trim()));
  }
  const existingDup = await db
    .select()
    .from(lead)
    .where(or(...dupConditions))
    .limit(1);

  if (existingDup.length > 0) {
    res.status(409).json({
      message: 'A lead with this email or phone number already exists.',
    });
    return;
  }

  const newLeadId = `lead_${crypto.randomUUID()}`;

  const createdLeads = await db
    .insert(lead)
    .values({
      id: newLeadId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? String(phone).trim() : null,
      company: company ? String(company).trim() : null,
      source: source ? String(source).trim() : 'dashboard',
      status: status || 'new',
      notes: notes ? String(notes).trim() : null,
      assignedTo: assignedTo ? String(assignedTo) : null,
    })
    .returning();

  // Create initial creation activity log
  await db.insert(leadNote).values({
    id: `note_${crypto.randomUUID()}`,
    leadId: newLeadId,
    authorId: session.user.id,
    content: `Lead created manually via ${source || 'dashboard'}`,
    type: 'creation',
  });

  if (notes && notes.trim()) {
    await db.insert(leadNote).values({
      id: `note_${crypto.randomUUID()}`,
      leadId: newLeadId,
      authorId: session.user.id,
      content: notes.trim(),
      type: 'note',
    });
  }

  // Trigger non-blocking email notification to the lead via Resend
  sendLeadConfirmationEmail({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? String(phone).trim() : null,
    company: company ? String(company).trim() : null,
    source: source ? String(source).trim() : 'dashboard',
    notes: notes ? String(notes).trim() : null,
  }).catch((err) =>
    console.error('[LeadController] Error sending dashboard lead email notification:', err),
  );

  res.status(201).json(createdLeads[0]);
});

// Authenticated endpoint to update lead status, details or assignment
export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const parseResult = updateLeadSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      message: parseResult.error.issues[0]?.message || 'Validation error',
      errors: parseResult.error.issues,
    });
    return;
  }

  const { id } = req.params;
  const data = parseResult.data;

  // Fetch existing lead state for activity logging comparison
  const existingLeads = await db
    .select()
    .from(lead)
    .where(eq(lead.id, String(id)));
  const existingLead = existingLeads[0];

  if (!existingLead) {
    res.status(404).json({ message: 'Lead not found' });
    return;
  }

  const updateData: Partial<typeof lead.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.email !== undefined) updateData.email = data.email.trim().toLowerCase();
  if (data.phone !== undefined) updateData.phone = data.phone ? data.phone.trim() : null;
  if (data.company !== undefined) updateData.company = data.company ? data.company.trim() : null;
  if (data.source !== undefined) updateData.source = data.source.trim();
  if (data.status !== undefined) updateData.status = data.status;
  if (data.notes !== undefined) updateData.notes = data.notes ? data.notes.trim() : null;
  if (data.assignedTo !== undefined)
    updateData.assignedTo = data.assignedTo ? data.assignedTo.trim() : null;

  const updatedLeads = await db
    .update(lead)
    .set(updateData)
    .where(eq(lead.id, String(id)))
    .returning();

  // Log status change activity
  if (data.status && data.status !== existingLead.status) {
    const formattedOld = existingLead.status.replace('_', ' ');
    const formattedNew = data.status.replace('_', ' ');
    await db.insert(leadNote).values({
      id: `note_${crypto.randomUUID()}`,
      leadId: String(id),
      authorId: session.user.id,
      content: `Status updated from "${formattedOld}" to "${formattedNew}"`,
      type: 'status_change',
    });
  }

  // Log assignment change activity
  if (data.assignedTo !== undefined && data.assignedTo !== existingLead.assignedTo) {
    let assigneeName = 'Unassigned';
    if (data.assignedTo) {
      const assignedUsers = await db.select().from(user).where(eq(user.id, data.assignedTo));
      if (assignedUsers[0]) {
        assigneeName = assignedUsers[0].name || assignedUsers[0].email;
      }
    }
    await db.insert(leadNote).values({
      id: `note_${crypto.randomUUID()}`,
      leadId: String(id),
      authorId: session.user.id,
      content: `Lead assigned to ${assigneeName}`,
      type: 'assignment_change',
    });
  }

  res.status(200).json(updatedLeads[0]);
});

// Authenticated endpoint to delete lead
export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { id } = req.params;

  await db.delete(lead).where(eq(lead.id, String(id)));

  res.status(200).json({ message: 'Lead deleted successfully', id });
});

// Authenticated endpoint to fetch notes & activity log for a lead
export const getLeadNotes = asyncHandler(async (req: Request, res: Response) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: 'Lead ID is required' });
    return;
  }

  const notesList = await db
    .select({
      id: leadNote.id,
      leadId: leadNote.leadId,
      authorId: leadNote.authorId,
      content: leadNote.content,
      type: leadNote.type,
      createdAt: leadNote.createdAt,
      author: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    })
    .from(leadNote)
    .leftJoin(user, eq(leadNote.authorId, user.id))
    .where(eq(leadNote.leadId, String(id)))
    .orderBy(desc(leadNote.createdAt));

  res.status(200).json(notesList);
});

// Authenticated endpoint to add a new note/comment to a lead
export const addLeadNote = asyncHandler(async (req: Request, res: Response) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const { content } = req.body;

  if (!id) {
    res.status(400).json({ message: 'Lead ID is required' });
    return;
  }

  if (!content || typeof content !== 'string' || !content.trim()) {
    res.status(400).json({ message: 'Note content cannot be empty' });
    return;
  }

  const noteId = `note_${crypto.randomUUID()}`;

  const inserted = await db
    .insert(leadNote)
    .values({
      id: noteId,
      leadId: String(id),
      authorId: session.user.id,
      content: content.trim(),
      type: 'note',
    })
    .returning();

  res.status(201).json(inserted[0]);
});
