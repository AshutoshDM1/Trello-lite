import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardName?: string;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteBoardModal({
  isOpen,
  onClose,
  boardName = '',
  onConfirm,
  isLoading = false,
}: DeleteBoardModalProps) {
  const handleDelete = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
              <AlertTriangle className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">Delete Board</DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">"{boardName}"</span>? All associated
            columns and tasks within this board will be permanently removed. This action cannot be
            undone.
          </p>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-4">
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
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
            className="text-xs gap-1.5 cursor-pointer shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>Delete Board</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
