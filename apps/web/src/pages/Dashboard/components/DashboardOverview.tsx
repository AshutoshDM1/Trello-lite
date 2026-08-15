import { useLeadsQuery, LEAD_STATUSES, type LeadStatus } from '@/hooks/useLeads';
import {
  FolderKanban,
  Trophy,
  Target,
  AlertCircle,
  TrendingUp,
  Globe,
  Share2,
  MessageSquare,
  Sparkles,
  Loader2,
  BarChart3,
} from 'lucide-react';

interface DashboardOverviewProps {
  usersCount?: number;
  isUsersLoading?: boolean;
}

const STATUS_LABELS: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: 'New', color: '#3b82f6' }, // blue-500
  contacted: { label: 'Contacted', color: '#f59e0b' }, // amber-500
  qualified: { label: 'Qualified', color: '#a855f7' }, // purple-500
  proposal_sent: { label: 'Proposal Sent', color: '#6366f1' }, // indigo-500
  won: { label: 'Won', color: '#10b981' }, // emerald-500
  lost: { label: 'Lost', color: '#f43f5e' }, // rose-500
};

const SOURCE_ICONS: Record<string, any> = {
  website: Globe,
  referral: Share2,
  linkedin: MessageSquare,
  social_media: Sparkles,
};

interface ChartDataPoint {
  name: string;
  count: number;
  color: string;
}

// Native Shadcn-Style Bar Graph Component (Zero dependencies)
function ShadcnBarGraph({ data }: { data: ChartDataPoint[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="w-full space-y-3">
      <div className="h-60 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-border relative">
        {/* Grid Background Lines */}
        <div className="absolute inset-x-0 top-0 border-b border-border/30 border-dashed" />
        <div className="absolute inset-x-0 top-1/4 border-b border-border/30 border-dashed" />
        <div className="absolute inset-x-0 top-2/4 border-b border-border/30 border-dashed" />
        <div className="absolute inset-x-0 top-3/4 border-b border-border/30 border-dashed" />

        {data.map((item) => {
          const heightPercent = Math.max(Math.round((item.count / maxCount) * 100), 6);
          return (
            <div
              key={item.name}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative z-10"
            >
              {/* Hover Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs font-mono py-1.5 px-3 rounded-lg border border-border shadow-lg absolute -top-10 z-20 pointer-events-none whitespace-nowrap flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-bold">{item.name}:</span>
                <span className="text-primary font-bold">{item.count}</span>
              </div>

              {/* Bar Container */}
              <div className="w-full max-w-12 bg-muted/30 rounded-t-lg overflow-hidden flex items-end h-full p-0.5">
                <div
                  className="w-full rounded-t-md transition-all duration-500 group-hover:brightness-110 shadow-xs"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-Axis Labels */}
      <div className="flex items-center justify-between gap-3 px-2">
        {data.map((item) => (
          <div key={item.name} className="flex-1 text-center">
            <span className="text-xs font-medium text-muted-foreground truncate block">
              {item.name}
            </span>
            <span className="text-xs font-mono text-foreground font-bold">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardOverview({ usersCount = 0 }: DashboardOverviewProps) {
  const { data: leadsResponse, isLoading } = useLeadsQuery({ limit: 100 });
  const leads = leadsResponse?.data || [];

  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === 'won').length;
  const qualifiedLeads = leads.filter(
    (l) => l.status === 'qualified' || l.status === 'proposal_sent',
  ).length;
  const newLeads = leads.filter((l) => l.status === 'new').length;

  const winRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0';

  // Chart Data: Status Breakdown
  const statusChartData: ChartDataPoint[] = LEAD_STATUSES.map((statusKey) => {
    const count = leads.filter((l) => l.status === statusKey).length;
    return {
      name: STATUS_LABELS[statusKey].label,
      count,
      color: STATUS_LABELS[statusKey].color,
    };
  });

  // Source Breakdown
  const sourcesMap: Record<string, number> = {};
  leads.forEach((l) => {
    const src = (l.source || 'website').toLowerCase();
    sourcesMap[src] = (sourcesMap[src] || 0) + 1;
  });

  const sourceEntries = Object.entries(sourcesMap).map(([src, count]) => ({
    name: src.replace('_', ' ').toUpperCase(),
    count,
    percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
    rawKey: src,
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground">
          Real-time lead analytics, stage breakdown, and acquisition performance.
        </p>
      </div>

      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center space-y-3 bg-card rounded-2xl border border-border shadow-xs">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-mono">Loading leads analytics...</p>
        </div>
      ) : (
        <>
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Leads */}
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Total Leads</span>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <FolderKanban className="size-4" />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-foreground">{totalLeads}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="text-blue-500 font-semibold">{newLeads} new</span> in pipeline
              </p>
            </div>

            {/* Card 2: Won Deals */}
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Won Deals</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Trophy className="size-4" />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-foreground">{wonLeads}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="size-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">{winRate}%</span> win rate
              </p>
            </div>

            {/* Card 3: Qualified Opportunities */}
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Qualified Deals</span>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                  <Target className="size-4" />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-foreground">
                {qualifiedLeads}
              </div>
              <p className="text-xs text-muted-foreground">Qualified & proposal sent</p>
            </div>

            {/* Card 4: Action Required */}
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Action Required</span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <AlertCircle className="size-4" />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-foreground">{newLeads}</div>
              <p className="text-xs text-amber-500 font-medium">Uncontacted new leads</p>
            </div>
          </div>

          {/* Lead Pipeline Graph & Lead Sources Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Card: Shadcn Bar Graph */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <BarChart3 className="size-4 text-primary" />
                    Pipeline Stage Breakdown
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Distribution of leads across sales pipeline stages
                  </p>
                </div>
              </div>

              {/* Native Shadcn Bar Chart Component */}
              <div className="pt-2">
                <ShadcnBarGraph data={statusChartData} />
              </div>
            </div>

            {/* Acquisition Channels Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Acquisition Channels</h3>
                <p className="text-xs text-muted-foreground">Lead sources breakdown</p>

                <div className="space-y-4 mt-6">
                  {sourceEntries.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No channel data available.</p>
                  ) : (
                    sourceEntries.map((src) => {
                      const IconComponent = SOURCE_ICONS[src.rawKey] || Globe;
                      return (
                        <div key={src.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 font-medium text-foreground">
                              <IconComponent className="size-3.5 text-primary" />
                              <span>{src.name}</span>
                            </div>
                            <span className="font-mono text-muted-foreground">
                              {src.count} ({src.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${src.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground flex items-center justify-between mt-4">
                <span>Team Members:</span>
                <span className="font-bold text-foreground font-mono">{usersCount} Active</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
