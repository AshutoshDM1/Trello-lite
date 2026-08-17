import { useState, useEffect } from 'react';
import { Loader2, Edit3, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EditBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardName?: string;
  onSubmit: (name: string) => Promise<void>;
  isLoading?: boolean;
}

export function EditBoardModal({
  isOpen,
  onClose,
  boardName = '',
  onSubmit,
  isLoading = false,
}: EditBoardModalProps) {
  const [name, setName] = useState(boardName);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(boardName);
      setError('');
    }
  }, [isOpen, boardName]);

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
          'Failed to rename board. Please try again.',
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Edit3 className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">Rename Board</DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Update the title for this workspace board.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Board Name <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Marketing Campaign, Sprint 12..."
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
              disabled={isLoading || !name.trim() || name.trim() === boardName}
              className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer gap-1.5 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="size-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
