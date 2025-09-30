import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
const PublicStatusPage = lazy(() => import('./pages/PublicStatusPage.jsx'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage.jsx'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage.jsx'));
const AdminTemplatesPage = lazy(() => import('./pages/AdminTemplatesPage.jsx'));
const AdminQuotesPage = lazy(() => import('./pages/AdminQuotesPage.jsx'));
const AdminHolidaysPage = lazy(() => import('./pages/AdminHolidaysPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const AdminOverridesPage = lazy(() => import('./pages/AdminOverridesPage.jsx'));
const AdminContactsPage = lazy(() => import('./pages/AdminContactsPage.jsx'));
import { useSession } from './queries/auth.js';
import { Spinner } from './components/ui/Spinner.jsx';
import { ToastProvider } from './components/ui/ToastProvider.jsx';
import { ConfirmProvider } from './components/ui/ConfirmProvider.jsx';

function ProtectedRoute({ children }) {
  const { data, error, isLoading } = useSession();

  const isUnauthorized =
    !!error && (error.status === 401 || error.status === 403 || /401|403|unauthorized|forbidden/i.test(error.message ?? ''));

  if (isUnauthorized || (!isLoading && !data?.authenticated)) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !isUnauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-center text-slate-200">
        <div className="space-y-2">
          <p className="text-lg font-semibold">Gagal memuat sesi</p>
          <p className="text-sm text-slate-400">Silakan refresh atau coba lagi nanti.</p>
        </div>
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <ConfirmProvider>
      <ToastProvider>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-950"><Spinner size="lg" /></div>}>
        <Routes>
          <Route path="/" element={<PublicStatusPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
        <Route
          path="/admin/templates"
          element={
            <ProtectedRoute>
              <AdminTemplatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quotes"
          element={
            <ProtectedRoute>
              <AdminQuotesPage />
            </ProtectedRoute>
          }
        />
          <Route
            path="/admin/contacts"
            element={
              <ProtectedRoute>
                <AdminContactsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/overrides"
            element={
              <ProtectedRoute>
                <AdminOverridesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/holidays"
            element={
              <ProtectedRoute>
                <AdminHolidaysPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      </ToastProvider>
    </ConfirmProvider>
  );
}


