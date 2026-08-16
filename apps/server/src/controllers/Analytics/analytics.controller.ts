import type { Request, Response } from 'express';
import { eq, sql } from 'drizzle-orm';
import db from '../../utils/db.js';
import { tasks, columns, user } from '../../db/schema.js';

/**
 * GET /api/v1/analytics/overview
 * Fetch workspace task metrics, column breakdown, priority distribution, and user count.
 */
export async function getOverviewAnalytics(_req: Request, res: Response): Promise<void> {
  try {
    // 1. Fetch total tasks count
    const [tasksCountRes] = await db.select({ count: sql<number>`count(*)::int` }).from(tasks);
    const totalTasks = Number(tasksCountRes?.count || 0);

    // 2. Fetch all columns to identify Done / In Progress / To Do columns
    const columnsList = await db.select().from(columns).orderBy(columns.position);

    // Fetch all tasks for distribution calculations
    const allTasks = await db.select().from(tasks);

    // Identify 'Done' column(s) by name case-insensitive
    const doneColumnIds = columnsList
      .filter(
        (c) => c.name.toLowerCase().includes('done') || c.name.toLowerCase().includes('completed'),
      )
      .map((c) => c.id);

    // Identify 'In Progress' column(s) by name
    const inProgressColumnIds = columnsList
      .filter(
        (c) => c.name.toLowerCase().includes('progress') || c.name.toLowerCase().includes('doing'),
      )
      .map((c) => c.id);

    // Count metrics
    const completedTasks = allTasks.filter((t) => doneColumnIds.includes(t.columnId)).length;
    const inProgressTasks = allTasks.filter((t) => inProgressColumnIds.includes(t.columnId)).length;
    const highPriorityTasks = allTasks.filter((t) => t.priority === 'High').length;

    const completionRate =
      totalTasks > 0 ? Number(((completedTasks / totalTasks) * 100).toFixed(1)) : 0;

    // 3. Column Stage Breakdown
    const columnBreakdown = columnsList.map((col) => {
      const colTaskCount = allTasks.filter((t) => t.columnId === col.id).length;
      const percentage =
        totalTasks > 0 ? Number(((colTaskCount / totalTasks) * 100).toFixed(1)) : 0;
      return {
        columnId: col.id,
        name: col.name,
        count: colTaskCount,
        percentage,
      };
    });

    // 4. Priority Breakdown
    const priorityCounts: Record<'High' | 'Medium' | 'Low', number> = {
      High: 0,
      Medium: 0,
      Low: 0,
    };

    allTasks.forEach((t) => {
      if (t.priority && priorityCounts[t.priority as 'High' | 'Medium' | 'Low'] !== undefined) {
        priorityCounts[t.priority as 'High' | 'Medium' | 'Low'] += 1;
      }
    });

    const priorityBreakdown = (['High', 'Medium', 'Low'] as const).map((p) => {
      const count = priorityCounts[p];
      const percentage = totalTasks > 0 ? Number(((count / totalTasks) * 100).toFixed(1)) : 0;
      return {
        priority: p,
        count,
        percentage,
      };
    });

    // 5. Active Team Members count
    const [usersCountRes] = await db.select({ count: sql<number>`count(*)::int` }).from(user);
    const activeTeamMembers = Number(usersCountRes?.count || 0);

    res.status(200).json({
      message: 'Overview analytics retrieved successfully',
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        highPriorityTasks,
        completionRate,
        columnBreakdown,
        priorityBreakdown,
        activeTeamMembers,
      },
    });
  } catch (error: any) {
    console.error('Error fetching overview analytics:', error);
    res.status(500).json({
      message: 'Failed to fetch overview analytics',
      error: error?.message || 'Internal Server Error',
    });
  }
}
