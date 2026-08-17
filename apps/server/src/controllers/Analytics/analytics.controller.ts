import type { Request, Response } from 'express';
import { eq, sql, inArray, desc, asc } from 'drizzle-orm';
import db from '../../utils/db.js';
import { boards, tasks, columns, user } from '../../db/schema.js';

/**
 * GET /api/v1/analytics/overview
 * Fetch workspace task metrics, 9-bar stage & priority breakdown, and user count.
 */
export async function getOverviewAnalytics(req: Request, res: Response): Promise<void> {
  try {
    const requestedBoardId = req.query.boardId as string | undefined;

    // 1. Identify target boards (if 'all' or omitted, query across all boards)
    let targetBoardIds: string[] = [];
    if (requestedBoardId && requestedBoardId !== 'all' && requestedBoardId !== '*') {
      targetBoardIds = requestedBoardId
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);
    }

    // 2. Fetch columns (filtered by target boards if specified, or all columns)
    const boardColumns =
      targetBoardIds.length > 0
        ? await db.select().from(columns).where(inArray(columns.boardId, targetBoardIds))
        : await db.select().from(columns);

    const columnIds = boardColumns.map((c) => c.id);

    // 3. Fetch tasks belonging to these columns
    const boardTasks =
      columnIds.length > 0
        ? await db.select().from(tasks).where(inArray(tasks.columnId, columnIds))
        : [];

    const totalTasks = boardTasks.length;

    // Helper to map columnId to standard stage name
    const getStageName = (colId: string): 'To Do' | 'In Progress' | 'Done' => {
      const col = boardColumns.find((c) => c.id === colId);
      if (!col) return 'To Do';
      const name = col.name.toLowerCase();
      if (name.includes('done') || name.includes('completed')) return 'Done';
      if (name.includes('progress') || name.includes('doing')) return 'In Progress';
      return 'To Do';
    };

    // Calculate core KPI metrics
    const completedTasks = boardTasks.filter((t) => getStageName(t.columnId) === 'Done').length;
    const inProgressTasks = boardTasks.filter(
      (t) => getStageName(t.columnId) === 'In Progress',
    ).length;
    const highPriorityTasks = boardTasks.filter((t) => t.priority === 'High').length;

    const completionRate =
      totalTasks > 0 ? Number(((completedTasks / totalTasks) * 100).toFixed(1)) : 0;

    // 9-Bar Stage & Priority Breakdown (To Do, In Progress, Done x Low, Medium, High)
    const stages = ['To Do', 'In Progress', 'Done'] as const;
    const priorities = ['Low', 'Medium', 'High'] as const;

    const stagePriorityBreakdown: Array<{
      stage: 'To Do' | 'In Progress' | 'Done';
      priority: 'Low' | 'Medium' | 'High';
      count: number;
      percentage: number;
    }> = [];

    stages.forEach((stage) => {
      const stageTasks = boardTasks.filter((t) => getStageName(t.columnId) === stage);
      priorities.forEach((priority) => {
        const count = stageTasks.filter((t) => t.priority === priority).length;
        const percentage = totalTasks > 0 ? Number(((count / totalTasks) * 100).toFixed(1)) : 0;
        stagePriorityBreakdown.push({
          stage,
          priority,
          count,
          percentage,
        });
      });
    });

    // Column Stage Breakdown
    const columnBreakdown = stages.map((stage) => {
      const count = boardTasks.filter((t) => getStageName(t.columnId) === stage).length;
      const percentage = totalTasks > 0 ? Number(((count / totalTasks) * 100).toFixed(1)) : 0;
      return {
        columnId: stage.toLowerCase().replace(/\s+/g, '-'),
        name: stage,
        count,
        percentage,
      };
    });

    // Priority Breakdown
    const priorityBreakdown = priorities.map((p) => {
      const count = boardTasks.filter((t) => t.priority === p).length;
      const percentage = totalTasks > 0 ? Number(((count / totalTasks) * 100).toFixed(1)) : 0;
      return {
        priority: p,
        count,
        percentage,
      };
    });

    // Active Team Members count
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
        stagePriorityBreakdown,
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
