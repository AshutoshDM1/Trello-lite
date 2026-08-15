import { Navigate, Outlet } from 'react-router-dom';
import { authClient } from '@/lib/auth-client';
import { Loader } from 'lucide-react';

export function ProtectedRoute() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 select-none">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <Loader className="size-6 text-indigo-500 animate-spin" />
        <p className="text-sm text-zinc-400 mt-4 animate-pulse">Please wait...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
