import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import asyncHandler from '../../utils/asyncHandler.js';
import { auth } from '../../lib/auth.js';
import db from '../../utils/db.js';
import { user, USER_ROLES } from '../../db/auth-schema.js';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const session = await auth.api.getSession({ headers: req.headers });
  const currentUserRole = (session?.user as any)?.role;

  if (!session || currentUserRole !== 'admin') {
    res.status(403).json({ message: 'Forbidden: Only admin users can view users directory' });
    return;
  }

  const users = await db.select().from(user);
  res.status(200).json(users);
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const session = await auth.api.getSession({ headers: req.headers });
  const currentUserRole = (session?.user as any)?.role;

  if (!session || currentUserRole !== 'admin') {
    res.status(403).json({ message: 'Forbidden: Only admin users can update roles' });
    return;
  }

  const { id } = req.params;
  const { role } = req.body;

  if (!role || typeof role !== 'string') {
    res.status(400).json({ message: 'Role is required' });
    return;
  }

  if (!USER_ROLES.includes(role as any)) {
    res.status(400).json({
      message: `Invalid role specified. Supported roles: ${USER_ROLES.join(', ')}`,
    });
    return;
  }

  const updatedUsers = await db
    .update(user)
    .set({ role, updatedAt: new Date() })
    .where(eq(user.id, String(id)))
    .returning();

  if (!updatedUsers.length) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.status(200).json(updatedUsers[0]);
});
