import { Plus, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type SortOption = 'created-desc' | 'created-asc' | 'priority-desc' | 'priority-asc';

interface BoardHeaderProps {
  boardName?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  onOpenCreateModal: () => void;
}

const PRIORITIES = ['All', 'High', 'Medium', 'Low'] as const;

export function BoardHeader({
  boardName = 'TaskFlow Board',
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  onOpenCreateModal,
}: BoardHeaderProps) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-border">
      {/* Title & Badge */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{boardName}</h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Manage your tasks, track progress across columns, and organize priorities.
        </p>
      </div>

      {/* Controls: Search, Priority Filters, Sort Select, Add Task */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-muted/30 border-border focus:bg-background transition-colors"
          />
        </div>

        {/* Priority Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40 border border-border">
          <Filter className="size-3.5 text-muted-foreground ml-1.5 mr-0.5" />
          {PRIORITIES.map((p) => {
            const active = priorityFilter === p;
            return (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  active
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Sort by Select */}
        <div className="flex items-center">
          <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
            <SelectTrigger className="h-9 min-w-44 text-xs bg-muted/30 border-border focus:bg-background cursor-pointer">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ArrowUpDown className="size-3.5 shrink-0" />
                <span className="text-foreground font-medium">
                  <SelectValue placeholder="Sort by" />
                </span>
              </div>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem className="text-xs" value="created-desc">
                Date: Newest First
              </SelectItem>
              <SelectItem className="text-xs" value="created-asc">
                Date: Oldest First
              </SelectItem>
              <SelectItem className="text-xs" value="priority-desc">
                Priority: High → Low
              </SelectItem>
              <SelectItem className="text-xs" value="priority-asc">
                Priority: Low → High
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add Task Trigger */}
        <Button
          onClick={onOpenCreateModal}
          size="sm"
          className="h-9 px-4 text-xs font-medium gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
        >
          <Plus className="size-4" />
          <span>Add Task</span>
        </Button>
      </div>
    </div>
  );
}
