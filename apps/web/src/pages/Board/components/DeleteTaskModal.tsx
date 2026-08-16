import { Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { TaskItem } from '@/hooks/useBoard';

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem | null;
  onConfirm: (taskId: string) => Promise<void>;
  isLoading?: boolean;
}

export function DeleteTaskModal({
  isOpen,
  onClose,
  task,
  onConfirm,
  isLoading = false,
}: DeleteTaskModalProps) {
  const handleDelete = async () => {
    if (!task) return;
    await onConfirm(task.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card text-foreground border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Delete Task</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="text-xs text-foreground/90 py-2">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-foreground">&quot;{task?.title}&quot;</span>?
        </p>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs border-border cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={isLoading}
            onClick={handleDelete}
            className="text-xs gap-1.5 cursor-pointer"
          >
            {isLoading && <Loader2 className="size-3.5 animate-spin" />}
            <span>Delete Task</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
