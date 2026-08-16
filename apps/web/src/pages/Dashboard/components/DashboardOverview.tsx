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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useOverviewAnalyticsQuery } from '@/hooks/useAnalytics';

export function DashboardOverview() {
  const { data, isLoading, isError, error, refetch } = useOverviewAnalyticsQuery();

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
          <span>Retry Loading</span>
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
    columnBreakdown,
    priorityBreakdown,
    activeTeamMembers,
  } = data;

  // Colors for column bars
  const columnBarColors = [
    'bg-blue-500 dark:bg-blue-400',
    'bg-amber-500 dark:bg-amber-400',
    'bg-emerald-500 dark:bg-emerald-400',
    'bg-purple-500 dark:bg-purple-400',
    'bg-rose-500 dark:bg-rose-400',
  ];

  // Maximum count in columns for chart scaling
  const maxColCount = Math.max(...columnBreakdown.map((c) => c.count), 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 select-none">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
        <p className="text-xs text-muted-foreground">
          Real-time task analytics, stage breakdown, and workspace performance.
        </p>
      </div>

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

        {/* Card 2: WON / COMPLETED DEALS */}
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

      {/* Main Grid: Bar Chart & Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 Panel: Pipeline Stage Breakdown (Bar Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.25 }}
          className="lg:col-span-2 p-6 rounded-2xl border border-border/80 bg-card shadow-xs flex flex-col justify-between space-y-6"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-primary" />
              <h2 className="font-bold text-base text-foreground tracking-tight">
                Pipeline Stage Breakdown
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Distribution of tasks across workspace pipeline stages
            </p>
          </div>

          {/* Bar Chart Graphics Container */}
          <div className="pt-4 pb-2">
            <div className="h-64 w-full flex items-end justify-around gap-4 sm:gap-8 px-2 border-b border-border/60">
              {columnBreakdown.map((col, idx) => {
                const heightPercentage = Math.max(Math.round((col.count / maxColCount) * 100), 8);
                const colorClass = columnBarColors[idx % columnBarColors.length];

                return (
                  <div
                    key={col.columnId}
                    className="flex-1 flex flex-col items-center h-full justify-end group"
                  >
                    {/* Bar track container */}
                    <div className="w-full max-w-[48px] h-full flex items-end justify-center bg-muted/20 dark:bg-muted/10 rounded-xl overflow-hidden p-1 border border-border/30 group-hover:border-primary/30 transition-colors">
                      {/* Inner Filled Bar with Framer Motion height animation */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 * idx }}
                        className={`w-full rounded-lg ${colorClass} shadow-xs transition-all`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Labels under bars */}
            <div className="flex items-center justify-around gap-4 sm:gap-8 pt-3 text-center">
              {columnBreakdown.map((col) => (
                <div key={col.columnId} className="flex-1 space-y-0.5">
                  <p className="text-xs font-semibold text-foreground truncate max-w-[90px] mx-auto">
                    {col.name}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground">{col.count}</p>
                </div>
              ))}
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
