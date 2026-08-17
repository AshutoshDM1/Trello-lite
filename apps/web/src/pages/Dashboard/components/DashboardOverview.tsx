import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ListTodo,
  Trophy,
  Clock,
  AlertTriangle,
  BarChart3,
  Users,
  TrendingUp,
  RefreshCw,
  FolderKanban,
  Filter,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useOverviewAnalyticsQuery } from '@/hooks/useAnalytics';
import { useBoardsListQuery } from '@/hooks/useBoard';

export function DashboardOverview() {
  const { data: boardsList = [] } = useBoardsListQuery();

  // Selected board IDs: 'all' means all boards combined. Can also hold an array of specific board IDs.
  const [selectedBoardIds, setSelectedBoardIds] = useState<string[]>(['all']);

  const isAllSelected = selectedBoardIds.includes('all');

  // Convert array to comma-separated query string
  const queryBoardParam = isAllSelected
    ? 'all'
    : selectedBoardIds.length > 0
      ? selectedBoardIds.join(',')
      : 'all';

  const { data, isLoading, isError, error, refetch } = useOverviewAnalyticsQuery(queryBoardParam);

  const handleToggleBoard = (boardId: string) => {
    if (isAllSelected) {
      // Switching from 'all' to a single specific board
      setSelectedBoardIds([boardId]);
    } else {
      if (selectedBoardIds.includes(boardId)) {
        const next = selectedBoardIds.filter((id) => id !== boardId);
        // If nothing is left selected, revert to 'all'
        setSelectedBoardIds(next.length > 0 ? next : ['all']);
      } else {
        const next = [...selectedBoardIds, boardId];
        // If all boards are individually checked, simplify to ['all']
        if (boardsList.length > 0 && next.length === boardsList.length) {
          setSelectedBoardIds(['all']);
        } else {
          setSelectedBoardIds(next);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-[350px] flex flex-col items-center justify-center border border-dashed border-destructive/30 bg-destructive/5 rounded-2xl p-8 text-center space-y-4">
        <AlertTriangle className="size-8 text-destructive" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">Failed to Load Overview Analytics</h3>
          <p className="text-xs text-muted-foreground">
            {(error as any)?.response?.data?.message ||
              (error as Error)?.message ||
              'Unable to connect to analytics service.'}
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          size="sm"
          variant="outline"
          className="text-xs gap-2 border-border cursor-pointer"
        >
          <RefreshCw className="size-3.5" />
          <span>Retry</span>
        </Button>
      </div>
    );
  }

  const {
    totalTasks,
    completedTasks,
    inProgressTasks,
    highPriorityTasks,
    completionRate,
    priorityBreakdown,
    activeTeamMembers,
  } = data;

  const stagePriorityBreakdown = data.stagePriorityBreakdown || [];
  const stagesList = ['To Do', 'In Progress', 'Done'] as const;

  // Maximum count among priority bars for chart scaling
  const maxPriorityCount = Math.max(...stagePriorityBreakdown.map((item) => item.count), 1);

  const priorityColors: Record<
    'Low' | 'Medium' | 'High',
    { bar: string; text: string; bg: string }
  > = {
    Low: {
      bar: 'bg-emerald-500 dark:bg-emerald-400',
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    Medium: {
      bar: 'bg-amber-500 dark:bg-amber-400',
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    High: {
      bar: 'bg-rose-500 dark:bg-rose-400',
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
          <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 border-border">
            {isAllSelected
              ? 'All Boards Combined'
              : `${selectedBoardIds.length} ${selectedBoardIds.length === 1 ? 'Board' : 'Boards'} Selected`}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Real-time task analytics, 9-stage priority breakdown, and workspace performance.
        </p>
      </div>

      {/* Board Multi-Selection Filter Bar */}
      {boardsList.length > 0 && (
        <div className="p-3 rounded-xl bg-card border border-border/80 flex flex-wrap items-center gap-2 shadow-xs">
          <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1.5">
            <Filter className="size-3.5" />
            <span>Scope:</span>
          </span>

          {/* All Boards Combined Button */}
          <button
            onClick={() => setSelectedBoardIds(['all'])}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              isAllSelected
                ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
            }`}
          >
            <FolderKanban className="size-3" />
            <span>All Boards Combined</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/10 dark:bg-white/10 rounded-full font-mono">
              {boardsList.reduce((acc, b) => acc + (b.tasksCount ?? 0), 0)} tasks
            </span>
          </button>

          {/* Individual Board Toggle Badges */}
          {boardsList.map((board) => {
            const isSelected = !isAllSelected && selectedBoardIds.includes(board.id);
            return (
              <button
                key={board.id}
                onClick={() => handleToggleBoard(board.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                    : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                }`}
              >
                {isSelected && <Check className="size-3" />}
                <span>{board.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-black/10 dark:bg-white/10 rounded-full font-mono">
                  {board.tasksCount ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL TASKS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
              Total Tasks
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <ListTodo className="size-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-3xl font-extrabold tracking-tight text-foreground">
              {totalTasks}
            </div>
            <p className="text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">{inProgressTasks} active</span> in
              pipeline
            </p>
          </div>
        </motion.div>

        {/* Card 2: COMPLETED TASKS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
              Completed Tasks
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Trophy className="size-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-3xl font-extrabold tracking-tight text-foreground">
              {completedTasks}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="size-3" />
              <span>{completionRate}% completion rate</span>
            </p>
          </div>
        </motion.div>

        {/* Card 3: IN PROGRESS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
              In Progress
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-3xl font-extrabold tracking-tight text-foreground">
              {inProgressTasks}
            </div>
            <p className="text-[11px] text-muted-foreground">Active work items</p>
          </div>
        </motion.div>

        {/* Card 4: ACTION REQUIRED / HIGH PRIORITY */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
              Action Required
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-3xl font-extrabold tracking-tight text-foreground">
              {highPriorityTasks}
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              High priority tasks
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Grid: 9-Bar Stage & Priority Chart & Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 Panel: Pipeline Stage Breakdown (9 Bars) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.25 }}
          className="lg:col-span-2 p-6 rounded-2xl border border-border/80 bg-card shadow-xs flex flex-col justify-between space-y-6"
        >
          {/* Header & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-primary" />
                <h2 className="font-bold text-base text-foreground tracking-tight">
                  Pipeline Stage Breakdown
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Tasks across To Do, In Progress, and Done by priority (9 bars)
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-emerald-500" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-amber-500" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-rose-500" />
                <span>High</span>
              </div>
            </div>
          </div>

          {/* 9-Bar Stage Clustered Chart */}
          <div className="pt-2 pb-2">
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-b border-border/60 pb-4">
              {stagesList.map((stageName, stageIdx) => {
                const stageTasks = stagePriorityBreakdown.filter((s) => s.stage === stageName);
                const stageTotal = stageTasks.reduce((acc, curr) => acc + curr.count, 0);

                return (
                  <div
                    key={stageName}
                    className="flex flex-col justify-between bg-muted/20 dark:bg-muted/10 rounded-xl p-3 border border-border/40"
                  >
                    {/* Stage Group Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40">
                      <span className="text-xs font-bold text-foreground">{stageName}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-background border border-border text-muted-foreground">
                        {stageTotal} total
                      </span>
                    </div>

                    {/* 3 Priority Bars in this Stage */}
                    <div className="h-48 flex items-end justify-around gap-2 pt-2">
                      {(['Low', 'Medium', 'High'] as const).map((pLevel, pIdx) => {
                        const item = stageTasks.find((s) => s.priority === pLevel);
                        const count = item?.count || 0;
                        const heightPct =
                          count > 0
                            ? Math.max(Math.round((count / maxPriorityCount) * 100), 12)
                            : 4;
                        const config = priorityColors[pLevel];

                        return (
                          <div
                            key={pLevel}
                            className="flex-1 flex flex-col items-center h-full justify-end group/bar"
                            title={`${stageName} • ${pLevel} Priority: ${count} task(s)`}
                          >
                            {/* Value label above bar */}
                            <span className="text-[10px] font-bold text-muted-foreground group-hover/bar:text-foreground transition-colors mb-1.5">
                              {count}
                            </span>

                            {/* Bar track */}
                            <div className="w-full max-w-[32px] h-32 flex items-end justify-center bg-muted/40 dark:bg-muted/20 rounded-lg overflow-hidden p-1 border border-border/30 group-hover/bar:border-primary/40 transition-colors">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPct}%` }}
                                transition={{
                                  duration: 0.5,
                                  ease: 'easeOut',
                                  delay: 0.04 * (stageIdx * 3 + pIdx),
                                }}
                                className={`w-full rounded-md ${config.bar} shadow-xs transition-all`}
                              />
                            </div>

                            {/* Priority Sub-Label */}
                            <span className="text-[10px] font-semibold text-muted-foreground mt-2">
                              {pLevel === 'Medium' ? 'Med' : pLevel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right 1/3 Panel: Priority Breakdown & Active Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.3 }}
          className="p-6 rounded-2xl border border-border/80 bg-card shadow-xs flex flex-col justify-between space-y-6"
        >
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="font-bold text-base text-foreground tracking-tight">
                Priority Distribution
              </h2>
              <p className="text-xs text-muted-foreground">Task volume by urgency level</p>
            </div>

            {/* Priority Progress Bars */}
            <div className="space-y-4">
              {priorityBreakdown.map((p) => {
                const barColor =
                  p.priority === 'High'
                    ? 'bg-rose-500'
                    : p.priority === 'Medium'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500';

                return (
                  <div key={p.priority} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wider text-muted-foreground">
                        {p.priority} Priority
                      </span>
                      <span className="font-semibold text-foreground">
                        {p.count} ({p.percentage}%)
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden border border-border/40">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`h-full rounded-full ${barColor}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Card: Team Members Active */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 dark:bg-muted/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Users className="size-4 text-muted-foreground/80" />
              <span>Team Members:</span>
            </div>
            <span className="text-xs font-extrabold text-foreground">
              {activeTeamMembers} Active
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
