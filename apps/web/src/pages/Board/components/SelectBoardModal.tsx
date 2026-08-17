import { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Check,
  Columns,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { BoardSummary } from '@/hooks/useBoard';

interface SelectBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardsList: BoardSummary[];
  currentBoardId?: string;
  onSelectBoard: (boardId: string) => void;
  onOpenCreateBoardModal: () => void;
}

export function SelectBoardModal({
  isOpen,
  onClose,
  boardsList = [],
  currentBoardId,
  onSelectBoard,
  onOpenCreateBoardModal,
}: SelectBoardModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBoards = boardsList.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (boardId: string) => {
    onSelectBoard(boardId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border shadow-xl p-6 px-8 ">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <FolderKanban className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Select Workspace Board
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Switch to an existing board or set up a new pipeline.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onClose();
                onOpenCreateBoardModal();
              }}
              className="h-8 text-xs font-medium gap-1.5 border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>New Board</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative pt-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search boards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8.5 h-8.5 text-xs bg-muted/40 border-border focus:bg-background transition-colors"
          />
        </div>

        {/* Boards List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1 pt-1 scrollbar-thin">
          {filteredBoards.length > 0 ? (
            filteredBoards.map((board) => {
              const isSelected = board.id === currentBoardId;
              const formattedDate = board.createdAt
                ? new Date(board.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recently';

              return (
                <div
                  key={board.id}
                  onClick={() => handleSelect(board.id)}
                  className={`group p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-xs'
                      : 'bg-muted/20 hover:bg-muted/60 border-border/80 hover:border-primary/40'
                  }`}
                >
                  <div className="space-y-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {board.name}
                      </h4>
                      {isSelected && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 bg-primary text-primary-foreground font-semibold"
                        >
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                      <span className="flex items-center gap-1">
                        <Columns className="size-3" />
                        {board.columnsCount ?? 3} Cols
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        {board.tasksCount ?? 0} Tasks
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center shrink-0">
                    {isSelected ? (
                      <div className="p-1 rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3.5" />
                      </div>
                    ) : (
                      <div className="p-1 rounded-full text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                        <ArrowRight className="size-4" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No boards matched your search.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
