import { Users, Shield, CheckCircle2, LayoutGrid, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardOverviewProps {
  usersCount?: number;
  isUsersLoading?: boolean;
}

export function DashboardOverview({
  usersCount = 0,
  isUsersLoading = false,
}: DashboardOverviewProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Workspace Overview</h2>
        <p className="text-sm text-muted-foreground">
          Welcome to your Trello Lite workspace. Manage team members, view profile, and configure
          settings.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Active Users */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Team Members</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {isUsersLoading ? '...' : usersCount}
          </div>
          <p className="text-xs text-muted-foreground">Registered users in workspace</p>
        </div>

        {/* Card 2: System Status */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>System Status</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-emerald-500">Operational</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="size-3.5" /> All services online
          </p>
        </div>

        {/* Card 3: Security & Auth */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Authentication</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Shield className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-foreground">Better-Auth</div>
          <p className="text-xs text-muted-foreground">Session & OAuth active</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <LayoutGrid className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Profile & Account</h3>
              <p className="text-xs text-muted-foreground">
                View your active session and role details
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-border bg-muted/40 text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <span>Go to Profile</span>
            <ArrowRight className="size-4" />
          </button>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">User Management</h3>
              <p className="text-xs text-muted-foreground">Manage user permissions and roles</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/users')}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-border bg-muted/40 text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <span>Manage Users</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
