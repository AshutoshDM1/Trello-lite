import { Navigate } from 'react-router-dom';
import { authClient } from '@/lib/auth-client';
import { Loader } from 'lucide-react';
import Auth from './components/Auth';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground select-none relative overflow-hidden">
        {/* Ambient primary glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-muted-foreground shadow-xs">
            <Loader className="size-3.5 text-primary animate-spin" />
            <span>Please wait...</span>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to /dashboard if authenticated
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render Auth component if not authenticated
  return <Auth />;
}
