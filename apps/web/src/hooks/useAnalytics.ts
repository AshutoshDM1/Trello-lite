import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export interface ColumnBreakdownItem {
  columnId: string;
  name: string;
  count: number;
  percentage: number;
}

export interface StagePriorityItem {
  stage: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  count: number;
  percentage: number;
}

export interface PriorityBreakdownItem {
  priority: 'High' | 'Medium' | 'Low';
  count: number;
  percentage: number;
}

export interface OverviewAnalyticsData {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  highPriorityTasks: number;
  completionRate: number;
  columnBreakdown: ColumnBreakdownItem[];
  stagePriorityBreakdown: StagePriorityItem[];
  priorityBreakdown: PriorityBreakdownItem[];
  activeTeamMembers: number;
}

export function useOverviewAnalyticsQuery(boardId: string = 'all') {
  return useQuery<OverviewAnalyticsData>({
    queryKey: ['analytics', 'overview', boardId],
    queryFn: async () => {
      const url =
        boardId && boardId !== 'all'
          ? `/analytics/overview?boardId=${boardId}`
          : '/analytics/overview';
      const response = await api.get(url);
      return response.data.data;
    },
    refetchOnWindowFocus: true,
  });
}
