import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Signup } from './pages/signup.page'
import { Login } from './pages/login.page'
import api from './utils/api'
import useUser from './hooks/useUser'
import ForgotPassword from './pages/ForgotPassword.page'
import { RouteProtector } from './utils/RouteProtector'
import AdminDashboardLayout from './layouts/Dashboard.layout'
import { UserControl } from './pages/dashboard/UserControl'
import Dashboard from './pages/dashboard/Dashboard'
import ConsumerControl from './pages/dashboard/ConsumerControl'
import Tariffs from './pages/dashboard/Tariffs'
import Billing from './pages/dashboard/Billing'
import Payments from './pages/dashboard/Payments'
import Complaints from './pages/dashboard/Complaints'
import Settings from './pages/dashboard/Settings'
import LoadingPage from './components/LoadingPage'
import LandingPage from './pages/LandingPage'
import NotAllowed from './pages/notAllowed'

const App = () => {
  const { user, setUser, loading, setLoading } = useUser();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // 1. Only fetch if we haven't checked for a user yet
      // This assumes 'user' starts as null/undefined in your hook
      try {
        const response = await api.get('/user/me');
        const userData = response.data?.data?.user;

        if (isMounted && userData) {
          setUser(userData);
        }
      } catch (error) {
        if (isMounted) {
          console.log("Session verification failed", error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Only run the check if we don't have a user and we ARE loading
    if (!user && loading) {
      checkAuth();
    } else {
      setLoading(false);
    }

    return () => { isMounted = false; };
    // Remove 'user' from dependencies to prevent re-authentication loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/not-allowed' element={<NotAllowed />} />

        {/* Protected Routes */}
        <Route element={<RouteProtector isAllowed={!!user} redirectTo="/login" />}>
          <Route element={<AdminDashboardLayout />}>
            <Route element={<RouteProtector isAllowed={user?.role === 'admin'} redirectTo="/not-allowed" />}>
              <Route path='/admin/dashboard/user-Control' element={<UserControl />} />
              <Route path='/admin/dashboard/tariffs' element={<Tariffs />} />
            </Route>
            <Route element={<RouteProtector isAllowed={user?.role === 'admin' || user?.role === 'staff'} redirectTo="/not-allowed" />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/dashboard/consumer-control' element={<ConsumerControl />} />
              <Route path='/dashboard/billing' element={<Billing />} />
              <Route path='/dashboard/payments' element={<Payments />} />
              <Route path='/dashboard/complaints' element={<Complaints />} />
              <Route path='/dashboard/settings' element={<Settings />} />
            </Route>
          </Route>
        </Route>
      </Routes></>
  );
}

export default App;