import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ColumnItem, PriorityLevel } from '@/hooks/useBoard';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnItem[];
  defaultColumnId?: string;
  onSubmit: (data: {
    title: string;
    description: string;
    columnId: string;
    priority: PriorityLevel;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  columns,
  defaultColumnId,
  onSubmit,
  isLoading = false,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState(defaultColumnId || columns[0]?.id || '');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Task title cannot be empty.');
      return;
    }

    try {
      setErrorMsg('');
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        columnId: columnId || columns[0]?.id || '',
        priority,
      });
      // Reset form
      setTitle('');
      setDescription('');
      setErrorMsg('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Failed to create task.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card text-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Create New Task</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Add a new card to your task board. Choose a column and priority level.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {errorMsg && (
            <div className="p-3 text-xs rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Design Landing Page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-muted/30 text-xs border-border"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Description</label>
            <Textarea
              placeholder="Add extra details or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-muted/30 text-xs border-border resize-none"
            />
          </div>

          {/* Column & Priority Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Column Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Column</label>
              <Select value={columnId} onValueChange={setColumnId}>
                <SelectTrigger className="bg-muted/30 text-xs border-border">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent className="bg-card text-foreground border-border">
                  {columns.map((col) => (
                    <SelectItem key={col.id} value={col.id} className="text-xs">
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Priority</label>
              <Select value={priority} onValueChange={(val) => setPriority(val as PriorityLevel)}>
                <SelectTrigger className="bg-muted/30 text-xs border-border">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-card text-foreground border-border">
                  <SelectItem value="Low" className="text-xs">
                    Low
                  </SelectItem>
                  <SelectItem value="Medium" className="text-xs">
                    Medium
                  </SelectItem>
                  <SelectItem value="High" className="text-xs">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-6 bg-card gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs border-border cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="text-xs gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading && <Loader2 className="size-3.5 animate-spin" />}
              <span>Create Task</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
