import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User as UserIcon,
  Users as UsersIcon,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/shared/Logo/Logo';

interface SidebarProps {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  currentUser?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
  currentUserRole?: string;
  onSignOut: () => void;
  getInitials: (name?: string | null) => string;
}

export function Sidebar({
  mobileSidebarOpen,
  setMobileSidebarOpen,
  currentUser,
  currentUserRole = 'member',
  onSignOut,
  getInitials,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isOverview = location.pathname === '/dashboard' || location.pathname === '/dashboard/';
  const isProfile = location.pathname.startsWith('/dashboard/profile');
  const isUsers = location.pathname.startsWith('/dashboard/users');

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-30">
        <Logo size="sm" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="text-foreground"
        >
          {mobileSidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 h-full bg-card border-r border-border flex flex-col justify-between overflow-hidden transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:z-auto md:h-screen md:sticky md:top-0`}
      >
        <div className="p-6 space-y-6">
          {/* Brand Header */}
          <Logo size="lg" subtitle="Workspace Portal" />

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => {
                navigate('/dashboard');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isOverview
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <LayoutDashboard className="size-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                navigate('/dashboard/profile');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isProfile
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <UserIcon className="size-4" />
              <span>Profile</span>
            </button>

            {currentUserRole === 'admin' && (
              <button
                onClick={() => {
                  navigate('/dashboard/users');
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isUsers
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <UsersIcon className="size-4" />
                <span>Users</span>
              </button>
            )}
          </nav>
        </div>

        {/* Sidebar Footer / Current User Profile */}
        <div className="p-4 border-t border-border space-y-3 bg-muted/30">
          <div className="flex items-center gap-3">
            {currentUser?.image ? (
              <img
                src={currentUser.image}
                alt={currentUser.name || 'User'}
                className="size-9 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold border border-border">
                {getInitials(currentUser?.name)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">{currentUser?.email}</p>
            </div>
          </div>

          <Button
            onClick={onSignOut}
            variant="outline"
            size="sm"
            className="w-full justify-center gap-2 border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-xs cursor-pointer transition-colors"
          >
            <LogOut className="size-3.5" />
            Sign Out
          </Button>

          <div className="text-center text-[11px] text-muted-foreground pt-2 border-t border-border/40">
            Built for{' '}
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              Digital Heroes Training Task
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
