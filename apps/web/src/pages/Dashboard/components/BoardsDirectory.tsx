import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Kanban,
  Plus,
  Search,
  Calendar,
  Columns,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  useBoardsListQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
  type BoardSummary,
} from '@/hooks/useBoard';
import { CreateBoardModal } from '@/pages/Board/components/CreateBoardModal';
import { EditBoardModal } from '@/pages/Board/components/EditBoardModal';
import { DeleteBoardModal } from '@/pages/Board/components/DeleteBoardModal';

export function BoardsDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<BoardSummary | null>(null);
  const [deletingBoard, setDeletingBoard] = useState<BoardSummary | null>(null);
  const navigate = useNavigate();

  const { data: boardsList = [], isLoading } = useBoardsListQuery();
  const createBoardMutation = useCreateBoardMutation();
  const updateBoardMutation = useUpdateBoardMutation();
  const deleteBoardMutation = useDeleteBoardMutation();

  const filteredBoards = boardsList.filter((board) =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateBoard = async (name: string) => {
    const newBoard = await createBoardMutation.mutateAsync({ name });
    if (newBoard?.id) {
      navigate(`/dashboard/board/${newBoard.id}`);
    }
  };

  const handleRenameBoard = async (name: string) => {
    if (editingBoard) {
      await updateBoardMutation.mutateAsync({ id: editingBoard.id, name });
    }
  };

  const handleDeleteBoard = async () => {
    if (deletingBoard) {
      await deleteBoardMutation.mutateAsync(deletingBoard.id);
    }
  };

  const handleSelectBoard = (boardId: string) => {
    navigate(`/dashboard/board/${boardId}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Workspace Boards</h1>
            <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 border-border">
              {boardsList.length} {boardsList.length === 1 ? 'Board' : 'Boards'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage your team's task boards, switch between workspaces, or create new pipelines.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-muted/30 border-border focus:bg-background transition-colors"
            />
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
            className="h-9 px-4 text-xs font-medium gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus className="size-4" />
            <span>New Board</span>
          </Button>
        </div>
      </div>

      {/* Boards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl border border-border/60 bg-card/50 p-6 space-y-4 animate-pulse"
            >
              <div className="h-5 w-1/2 bg-muted rounded-md" />
              <div className="h-3 w-3/4 bg-muted/70 rounded-md" />
              <div className="h-8 w-full bg-muted/40 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredBoards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoards.map((board, idx) => {
            const formattedDate = board.createdAt
              ? new Date(board.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recently';

            return (
              <motion.div
                key={board.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.04 * idx }}
                onClick={() => handleSelectBoard(board.id)}
                className="group relative bg-card hover:bg-card/95 border border-border/50 hover:border-border/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  {/* Top Bar with Icon & Date */}
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                      <Kanban className="size-5" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                      <Calendar className="size-3" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {/* Board Title & Action Buttons */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                        {board.name}
                      </h3>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingBoard(board);
                          }}
                          className="size-7 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg hover:bg-muted"
                          title="Rename Board"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        {boardsList.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingBoard(board);
                            }}
                            className="size-7 text-muted-foreground hover:text-destructive cursor-pointer rounded-lg hover:bg-destructive/10"
                            title="Delete Board"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      ID: <span className="font-mono text-[11px]">{board.id}</span>
                    </p>
                  </div>
                </div>

                {/* Stats & Launch Link */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Columns className="size-3.5" />
                      {board.columnsCount ?? 3} Cols
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" />
                      {board.tasksCount ?? 0} Tasks
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                    <span>Open</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* New Board Card Trigger */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.04 * filteredBoards.length }}
            onClick={() => setIsCreateModalOpen(true)}
            className="min-h-44 border border-dashed border-primary/30 hover:border-primary/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer group bg-muted/10 hover:bg-primary/5 transition-all"
          >
            <div className="p-3 rounded-full bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
              <Plus className="size-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                Create New Board
              </p>
              <p className="text-xs text-muted-foreground">
                Set up a fresh pipeline with standard columns
              </p>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="min-h-72 w-full flex flex-col items-center justify-center border border-dashed border-border rounded-2xl p-8 text-center space-y-4 bg-muted/10">
          <div className="p-3 rounded-full bg-muted text-muted-foreground">
            <Sparkles className="size-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-foreground">No Boards Found</h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery
                ? `No boards matched "${searchQuery}". Try a different search query.`
                : 'No boards have been created yet. Create your first board to get started.'}
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
            className="text-xs bg-primary text-primary-foreground gap-1.5 cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Create Board</span>
          </Button>
        </div>
      )}

      {/* Modals */}
      <DeleteBoardModal
        isOpen={!!deletingBoard}
        onClose={() => setDeletingBoard(null)}
        boardName={deletingBoard?.name}
        onConfirm={handleDeleteBoard}
        isLoading={deleteBoardMutation.isPending}
      />

      <EditBoardModal
        isOpen={!!editingBoard}
        onClose={() => setEditingBoard(null)}
        boardName={editingBoard?.name}
        onSubmit={handleRenameBoard}
        isLoading={updateBoardMutation.isPending}
      />

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBoard}
        isLoading={createBoardMutation.isPending}
      />
    </div>
  );
}
