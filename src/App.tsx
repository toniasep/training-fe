import { Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { AppShell } from '@/app/_components/app-shell';

import LoginPage from '@/app/login/page';
import DashboardPage from '@/app/dashboard/page';
import UsersPage from '@/app/users/page';
import UserDetailPage from '@/app/users/[id]/page';
import RequestsPage from '@/app/requests/page';
import RequestDetailPage from '@/app/requests/[id]/page';
import AuditLogsPage from '@/app/audit-logs/page';
import NotFoundPage from '@/app/not-found/page';
import ForbiddenPage from '@/app/forbidden/page';
import { useAuth } from '@/app/_components/auth-context';
import { Spinner } from '@/components/ui/spinner';

function ProtectedLayout() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <Spinner className="h-8 w-8 text-blue-600" />
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function App() {
  return (
    <Routes>
      {/* Route Publik (Tanpa Sidebar) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />

      {/* Route Terlindungi (Memakai Sidebar & Topbar) */}
      <Route element={<ProtectedLayout />}>
        {/* Redirect root ke dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/requests/:id" element={<RequestDetailPage />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />
      </Route>

      {/* Catch-all Route untuk 404 Not Found (Tanpa Sidebar) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App;
