import { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useBoardQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useMoveTaskMutation,
  useDeleteTaskMutation,
  type TaskItem,
  type PriorityLevel,
} from '@/hooks/useBoard';
import { BoardHeader } from './components/BoardHeader';
import { BoardColumn } from './components/BoardColumn';
import { BoardSkeleton } from './components/BoardSkeleton';
import { CreateTaskModal } from './components/CreateTaskModal';
import { EditTaskModal } from './components/EditTaskModal';
import { DeleteTaskModal } from './components/DeleteTaskModal';

export default function BoardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal open states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDefaultColumnId, setCreateDefaultColumnId] = useState<string | undefined>();

  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskItem | null>(null);

  // Queries & Mutations
  const {
    data: boardData,
    isLoading,
    isError,
    error,
    refetch,
  } = useBoardQuery('board_demo_1', priorityFilter);

  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const moveTaskMutation = useMoveTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const columns = boardData?.columns || [];

  const handleOpenCreateModal = (columnId?: string) => {
    setCreateDefaultColumnId(columnId);
    setIsCreateModalOpen(true);
  };

  const handleCreateTask = async (data: {
    title: string;
    description: string;
    columnId: string;
    priority: PriorityLevel;
  }) => {
    await createTaskMutation.mutateAsync(data);
  };

  const handleUpdateTask = async (data: {
    id: string;
    title: string;
    description: string;
    columnId: string;
    priority: PriorityLevel;
  }) => {
    await updateTaskMutation.mutateAsync(data);
  };

  const handleMoveTask = async (taskId: string, targetColumnId: string) => {
    await moveTaskMutation.mutateAsync({ id: taskId, columnId: targetColumnId });
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync(taskId);
  };

  if (isLoading) {
    return <BoardSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center border border-dashed border-destructive/30 bg-destructive/5 rounded-2xl p-8 text-center space-y-4">
        <div className="p-3 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
          <AlertCircle className="size-6" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-base font-bold text-foreground">Failed to Load Task Board</h2>
          <p className="text-xs text-muted-foreground">
            {(error as any)?.response?.data?.message ||
              (error as Error)?.message ||
              'Could not connect to backend server. Please verify backend service status.'}
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          size="sm"
          variant="outline"
          className="text-xs gap-2 border-border cursor-pointer"
        >
          <RefreshCw className="size-3.5" />
          <span>Retry Connection</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none">
      {/* Board Header & Controls */}
      <BoardHeader
        boardName={boardData?.name || 'TaskFlow Board'}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onOpenCreateModal={() => handleOpenCreateModal()}
      />

      {/* Board Columns Grid */}
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-6 scrollbar-thin">
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            columns={columns}
            searchQuery={searchQuery}
            onEditTask={(task) => setEditingTask(task)}
            onDeleteTask={(task) => setDeletingTask(task)}
            onMoveTask={handleMoveTask}
            onAddTaskToColumn={(colId) => handleOpenCreateModal(colId)}
            isMoving={moveTaskMutation.isPending}
          />
        ))}
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        columns={columns}
        defaultColumnId={createDefaultColumnId}
        onSubmit={handleCreateTask}
        isLoading={createTaskMutation.isPending}
      />

      <EditTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        columns={columns}
        onSubmit={handleUpdateTask}
        isLoading={updateTaskMutation.isPending}
      />

      <DeleteTaskModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        task={deletingTask}
        onConfirm={handleDeleteTask}
        isLoading={deleteTaskMutation.isPending}
      />
    </div>
  );
}
