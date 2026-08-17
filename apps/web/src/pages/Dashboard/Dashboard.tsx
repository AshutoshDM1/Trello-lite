import { useState } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useUsersQuery } from '@/hooks/useUsers';
import { useHotkeys } from '@/hooks/useHotkeys';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { BoardsDirectory } from './components/BoardsDirectory';
import { UserProfile } from './components/UserProfile';
import { UsersDirectory } from './components/UsersDirectory';
import BoardPage from '../Board/BoardPage';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const { data: usersList, isLoading: isUsersLoading, isError: isUsersError } = useUsersQuery();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate('/', { replace: true });
        },
      },
    });
  };

  const currentUser = session?.user;
  const currentUserRole =
    (currentUser as any)?.role ||
    usersList?.find((u) => u.id === currentUser?.id || u.email === currentUser?.email)?.role ||
    'member';

  useHotkeys({ userRole: currentUserRole });

  if (isPending) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Extract initials for fallback avatar
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formattedCreatedDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className="h-screen w-full bg-background text-foreground font-sans flex flex-col md:flex-row overflow-hidden select-none">
      {/* Sidebar Navigation Sub-component */}
      <Sidebar
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        currentUser={currentUser}
        currentUserRole={currentUserRole}
        onSignOut={handleSignOut}
        getInitials={getInitials}
      />

      {/* Main Content Pane with React Router Routes */}
      <main className="flex-1 min-w-0 h-full bg-background p-4 md:p-8  overflow-y-auto">
        <Routes>
          <Route index element={<DashboardOverview />} />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="boards" element={<BoardsDirectory />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="board/:boardId" element={<BoardPage />} />
          <Route
            path="profile"
            element={
              <UserProfile
                currentUser={currentUser}
                sessionId={session?.session?.id}
                formattedCreatedDate={formattedCreatedDate}
                getInitials={getInitials}
              />
            }
          />
          <Route
            path="users"
            element={
              currentUserRole === 'admin' ? (
                <UsersDirectory
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  usersList={usersList}
                  isUsersLoading={isUsersLoading}
                  isUsersError={isUsersError}
                  currentUserRole={currentUserRole}
                  getInitials={getInitials}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}
