import { useState, useEffect } from 'react';
import { Loader2, Plus, Layout } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  isLoading?: boolean;
}

export function CreateBoardModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateBoardModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Board name cannot be empty');
      return;
    }

    try {
      await onSubmit(name.trim());
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.errors?.name?.[0] ||
          err?.response?.data?.message ||
          'Failed to create board. Please try again.',
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Layout className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Create New Board
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Create a new workspace board. Default columns (To Do, In Progress, Done) will be
            automatically generated.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Board Name <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Marketing Campaign, Sprint 12, Product Roadmap..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="text-xs h-9 bg-muted/30 border-border focus:bg-background"
              autoFocus
            />
            {error && <p className="text-[11px] font-medium text-destructive">{error}</p>}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs border-border cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !name.trim()}
              className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer gap-1.5 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  <span>Create Board</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
