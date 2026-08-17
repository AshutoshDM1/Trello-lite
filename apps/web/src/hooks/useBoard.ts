import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export type PriorityLevel = 'Low' | 'Medium' | 'High';

export interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  columnId: string;
  priority: PriorityLevel;
  createdAt: string;
  updatedAt: string;
}

export interface ColumnItem {
  id: string;
  name: string;
  boardId: string;
  position: number;
  tasks: TaskItem[];
}

export interface BoardData {
  id: string;
  name: string;
  columns: ColumnItem[];
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  columnId: string;
  priority?: PriorityLevel;
}

export interface UpdateTaskPayload {
  id: string;
  title?: string;
  description?: string | null;
  columnId?: string;
  priority?: PriorityLevel;
}

export interface MoveTaskPayload {
  id: string;
  columnId: string;
}

export interface BoardSummary {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  columnsCount?: number;
  tasksCount?: number;
}

/**
 * Query hook for listing all boards
 */
export function useBoardsListQuery() {
  return useQuery<BoardSummary[]>({
    queryKey: ['boards'],
    queryFn: async () => {
      const response = await api.get('/boards');
      return response.data.data;
    },
    refetchOnWindowFocus: true,
  });
}

/**
 * Mutation hook to create a new board
 */
export function useCreateBoardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string }) => {
      const response = await api.post('/boards', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

/**
 * Mutation hook to update / rename a board
 */
export function useUpdateBoardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await api.patch(`/boards/${id}`, { name });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['board', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

/**
 * Mutation hook to delete a board
 */
export function useDeleteBoardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (boardId: string) => {
      const response = await api.delete(`/boards/${boardId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['board'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

/**
 * Query hook for board details with nested columns and tasks
 */
export function useBoardQuery(boardId: string = 'board_demo_1', priorityFilter?: string) {
  return useQuery<BoardData>({
    queryKey: ['board', boardId, priorityFilter || 'All'],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (priorityFilter && priorityFilter !== 'All') {
        params.priority = priorityFilter;
      }
      const response = await api.get(`/boards/${boardId}`, { params });
      return response.data.data;
    },
    refetchOnWindowFocus: false,
  });
}

/**
 * Mutation hook to create a task
 */
export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      const response = await api.post('/tasks', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] });
    },
  });
}

/**
 * Mutation hook to update task details
 */
export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateTaskPayload) => {
      const response = await api.patch(`/tasks/${id}`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] });
    },
  });
}

/**
 * Mutation hook to move a task to another column
 */
export function useMoveTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, columnId }: MoveTaskPayload) => {
      const response = await api.patch(`/tasks/${id}/move`, { columnId });
      return response.data.data;
    },
    onMutate: async ({ id, columnId }) => {
      await queryClient.cancelQueries({ queryKey: ['board'] });
      const previousQueries = queryClient.getQueriesData<BoardData>({ queryKey: ['board'] });

      queryClient.setQueriesData<BoardData>({ queryKey: ['board'] }, (old) => {
        if (!old) return old;
        let movedTask: TaskItem | undefined;

        const newColumns = old.columns.map((col) => {
          const task = col.tasks.find((t) => t.id === id);
          if (task) {
            movedTask = { ...task, columnId };
            return {
              ...col,
              tasks: col.tasks.filter((t) => t.id !== id),
            };
          }
          return col;
        });

        if (movedTask) {
          return {
            ...old,
            columns: newColumns.map((col) => {
              if (col.id === columnId) {
                return {
                  ...col,
                  tasks: [...col.tasks, movedTask!],
                };
              }
              return col;
            }),
          };
        }
        return old;
      });

      return { previousQueries };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] });
    },
  });
}

/**
 * Mutation hook to delete a task
 */
export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] });
    },
  });
}
