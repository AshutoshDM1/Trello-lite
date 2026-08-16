import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export interface ColumnBreakdownItem {
  columnId: string;
  name: string;
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
  priorityBreakdown: PriorityBreakdownItem[];
  activeTeamMembers: number;
}

export function useOverviewAnalyticsQuery() {
  return useQuery<OverviewAnalyticsData>({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const response = await api.get('/analytics/overview');
      return response.data.data;
    },
    refetchOnWindowFocus: true,
  });
}
