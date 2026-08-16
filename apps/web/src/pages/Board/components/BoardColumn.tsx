import { motion } from 'framer-motion';
import { Plus, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';
import type { ColumnItem, TaskItem } from '@/hooks/useBoard';

interface BoardColumnProps {
  column: ColumnItem;
  columns: ColumnItem[];
  searchQuery: string;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onMoveTask: (taskId: string, targetColumnId: string) => void;
  onAddTaskToColumn: (columnId: string) => void;
  isMoving?: boolean;
}

export function BoardColumn({
  column,
  columns,
  searchQuery,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onAddTaskToColumn,
  isMoving = false,
}: BoardColumnProps) {
  // Filter tasks client-side by search query
  const filteredTasks = (column.tasks || []).filter((t) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(query) ||
      (t.description && t.description.toLowerCase().includes(query))
    );
  });

  const columnColorIndicator =
    column.position === 0
      ? 'bg-blue-500'
      : column.position === 1
        ? 'bg-amber-500'
        : 'bg-emerald-500';

  return (
    <div className="flex flex-col w-full md:w-80 lg:w-96 shrink-0 bg-muted/20 dark:bg-muted/10 border border-border/70 rounded-2xl p-4 space-y-4 max-h-[calc(100vh-12rem)] min-h-[500px] overflow-hidden">
      {/* Column Header */}
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2.5">
          <span className={`size-2.5 rounded-full ${columnColorIndicator}`} />
          <h2 className="font-semibold text-sm text-foreground tracking-tight">{column.name}</h2>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-muted text-muted-foreground border border-border">
            {filteredTasks.length}
          </span>
        </div>

        <Button
          onClick={() => onAddTaskToColumn(column.id)}
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
          title={`Add task to ${column.name}`}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Task Cards Container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columns={columns}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
              isMoving={isMoving}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-44 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 p-4 text-center space-y-2 text-muted-foreground"
          >
            <Inbox className="size-8 stroke-1 text-muted-foreground/50" />
            <p className="text-xs font-medium">No tasks in {column.name}</p>
            <Button
              onClick={() => onAddTaskToColumn(column.id)}
              variant="outline"
              size="sm"
              className="h-7 text-xs border-border cursor-pointer gap-1 mt-1"
            >
              <Plus className="size-3" />
              <span>Add Task</span>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
