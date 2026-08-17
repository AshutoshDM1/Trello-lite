import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Edit2, Trash2, ArrowRightLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TaskItem, ColumnItem } from '@/hooks/useBoard';

interface TaskCardProps {
  task: TaskItem;
  columns: ColumnItem[];
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  onMove: (taskId: string, targetColumnId: string) => void;
  isMoving?: boolean;
}

export function TaskCard({
  task,
  columns,
  onEdit,
  onDelete,
  onMove,
  isMoving = false,
}: TaskCardProps) {
  const otherColumns = columns.filter((c) => c.id !== task.columnId);

  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : '';

  const priorityVariant =
    task.priority === 'High' ? 'high' : task.priority === 'Medium' ? 'medium' : 'low';

  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      draggable
      onDragStartCapture={(e: React.DragEvent) => {
        setIsDragging(true);
        e.dataTransfer.setData(
          'text/plain',
          JSON.stringify({ taskId: task.id, fromColumnId: task.columnId }),
        );
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragEndCapture={() => {
        setIsDragging(false);
      }}
      className={`group relative bg-card hover:bg-card/95 border rounded-xl p-4 shadow-xs hover:shadow-md transition-all space-y-3 cursor-grab active:cursor-grabbing ${
        isDragging
          ? 'opacity-40 border-dashed border-primary scale-98 ring-2 ring-primary/20'
          : 'border-border/80 hover:border-primary/40'
      }`}
    >
      {/* Header: Priority & Quick Actions */}
      <div className="flex items-center justify-between gap-2">
        <Badge variant={priorityVariant} className="capitalize text-[11px] px-2 py-0.5">
          {task.priority} Priority
        </Badge>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {/* Move Quick Dropdown/Buttons */}
          {otherColumns.map((col) => (
            <Button
              key={col.id}
              onClick={() => onMove(task.id, col.id)}
              disabled={isMoving}
              variant="outline"
              size="sm"
              className="h-6 px-1.5 text-[10px] gap-1 border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              title={`Move to ${col.name}`}
            >
              <ArrowRightLeft className="size-2.5" />
              <span className="hidden sm:inline">{col.name}</span>
            </Button>
          ))}

          {/* Edit */}
          <Button
            onClick={() => onEdit(task)}
            variant="ghost"
            size="icon"
            className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Edit Task"
          >
            <Edit2 className="size-3" />
          </Button>

          {/* Delete */}
          <Button
            onClick={() => onDelete(task)}
            variant="ghost"
            size="icon"
            className="size-6 text-muted-foreground hover:text-destructive cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-1">
        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-normal">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer: Date */}
      {formattedDate && (
        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-3 text-muted-foreground/70" />
            {formattedDate}
          </span>
        </div>
      )}
    </motion.div>
  );
}
