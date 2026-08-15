import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './components/theme-provider';
import { ThemeToggle } from './components/theme-toggle';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="trello-lite-theme">
        <BrowserRouter>
          <Routes>
            {/* Public Home Route (Login / Landing) */}
            <Route path="/" element={<Home />} />

            {/* Protected Dashboard Route */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Route>

            {/* Fallback Catch-All Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Persistent Theme Toggle in bottom-right corner */}
          <ThemeToggle className="fixed bottom-4 right-4 z-50 rounded-full border border-border shadow-lg bg-background text-foreground hover:bg-muted transition-all" />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
