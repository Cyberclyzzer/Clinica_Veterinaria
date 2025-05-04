import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import { UserRole } from './types/index';

// Lazy load pages to improve initial load time
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const StaffDashboard = lazy(() => import('./pages/staff/StaffDashboard'));
const AppointmentsPage = lazy(() => import('./pages/staff/AppointmentsPage'));
const TreatmentsPage = lazy(() => import('./pages/staff/TreatmentsPage'));
const PagosPage = lazy(() => import('./pages/staff/PagosPage'));

const OwnerDashboard = lazy(() => import('./pages/owner/OwnerDashboard'));
const OwnerPetsPage = lazy(() => import('./pages/owner/OwnerPetsPage'));
const OwnerAppointmentsPage = lazy(() => import('./pages/owner/OwnerAppointmentsPage'));
const OwnerPagosPage = lazy(() => import('./pages/owner/OwnerPagosPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Staff Routes */}
        <Route 
          path="/staff" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.STAFF, UserRole.ADMIN]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StaffDashboard />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="treatments" element={<TreatmentsPage />} />
          <Route path="pagos" element={<PagosPage />} />
        </Route>
        
        {/* Pet Owner Routes */}
        <Route 
          path="/owner" 
          element={
              <Layout />
          }
        >
          <Route index element={<OwnerDashboard />} />
          <Route path="pets" element={<OwnerPetsPage />} />
          <Route path="appointments" element={<OwnerAppointmentsPage />} />
          <Route path="pagos" element={<OwnerPagosPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;