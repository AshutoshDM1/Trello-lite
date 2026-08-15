import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Calendar,
  Key,
  CheckCircle,
  Shield,
  Command,
} from 'lucide-react';

interface UserProfileProps {
  currentUser?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    image?: string | null;
    createdAt?: string | Date;
  };
  sessionId?: string;
  formattedCreatedDate: string;
  getInitials: (name?: string | null) => string;
}

export function UserProfile({
  currentUser,
  // sessionId,
  formattedCreatedDate,
  getInitials,
}: UserProfileProps) {
  const role = currentUser?.role || 'member';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">User Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your profile information, active session, and view system shortcuts.
        </p>
      </div>

      {/* Welcome Profile Header Card */}
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Profile Avatar / Photo */}
          <div className="relative shrink-0">
            {currentUser?.image ? (
              <img
                src={currentUser.image}
                alt={currentUser.name || 'User'}
                className="size-20 rounded-xl object-cover border border-border"
              />
            ) : (
              <div className="size-20 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold border border-border">
                {getInitials(currentUser?.name)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-background text-background">
              <CheckCircle className="size-3.5 fill-emerald-500 stroke-background" />
            </div>
          </div>

          {/* User Greeting */}
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-muted border border-border text-muted-foreground text-xs font-mono">
                <ShieldCheck className="size-3.5 text-foreground" /> Authenticated Account
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold capitalize">
                <Shield className="size-3" />
                {role}
              </div>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              {currentUser?.name || 'User'}
            </h3>
            <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
          </div>
        </div>
      </div>

      {/* User Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Full Name Card */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-1.5 shadow-sm">
          <div className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider gap-2">
            <UserIcon className="size-4 text-foreground" />
            Full Name
          </div>
          <p className="text-base font-medium text-foreground wrap-break-word">
            {currentUser?.name || 'Not specified'}
          </p>
        </div>

        {/* Email Card */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-1.5 shadow-sm">
          <div className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider gap-2">
            <Mail className="size-4 text-foreground" />
            Email Address
          </div>
          <p className="text-base font-medium text-foreground break-all">
            {currentUser?.email || 'N/A'}
          </p>
        </div>

        {/* User ID Card */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-1.5 shadow-sm">
          <div className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider gap-2">
            <Key className="size-4 text-foreground" />
            User ID
          </div>
          <p className="text-xs font-mono text-foreground break-all bg-muted p-2 rounded-lg border border-border">
            {currentUser?.id || 'N/A'}
          </p>
        </div>

        {/* Account Created Date */}
        <div className="p-5 rounded-xl border border-border bg-card space-y-1.5 shadow-sm">
          <div className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider gap-2">
            <Calendar className="size-4 text-foreground" />
            Account Created
          </div>
          <p className="text-base font-medium text-foreground">{formattedCreatedDate}</p>
        </div>
      </div>

      {/* Keyboard Shortcuts Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
            <Command className="size-4 text-primary" /> Keyboard Shortcuts & Hotkeys
          </h3>
          <p className="text-xs text-muted-foreground">
            Quick keyboard navigation shortcuts available across the portal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
            <span className="text-xs font-medium text-foreground">Focus Search Bar</span>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-[11px] font-mono font-semibold text-foreground bg-background rounded border border-border shadow-xs">
                Ctrl
              </kbd>
              <span className="text-xs text-muted-foreground">+</span>
              <kbd className="px-2 py-0.5 text-[11px] font-mono font-semibold text-foreground bg-background rounded border border-border shadow-xs">
                K
              </kbd>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
            <span className="text-xs font-medium text-foreground">Close Modals</span>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-[11px] font-mono font-semibold text-foreground bg-background rounded border border-border shadow-xs">
                Esc
              </kbd>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
            <span className="text-xs font-medium text-foreground">Quick Tab Navigation</span>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-[11px] font-mono font-semibold text-foreground bg-background rounded border border-border shadow-xs">
                Alt
              </kbd>
              <span className="text-xs text-muted-foreground">+</span>
              <kbd className="px-2 py-0.5 text-[11px] font-mono font-semibold text-foreground bg-background rounded border border-border shadow-xs">
                1 .. 4
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
