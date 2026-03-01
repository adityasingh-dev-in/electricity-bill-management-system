import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Signup } from './pages/signup.page'
import { Login } from './pages/login.page'
import api from './utils/api'
import useUser from './hooks/useUser'
import ForgotPassword from './pages/ForgotPassword.page'
import { RouteProtector } from './utils/RouteProtector'
import AdminDashboardLayout from './layouts/adminDashboard.layout'
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

const App = () => {
  const { user, setUser, loading, setLoading } = useUser();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // If we don't have a user, try to fetch current session
      if (!user) {
        try {
          // This call triggers the interceptor if AccessToken is missing
          const response = await api.get('/user/me');
          const userData = response.data?.data?.user;
          
          if (isMounted && userData) {
            setUser(userData);
          }
        } catch (error) {
          if (isMounted) {
            console.log("Session verification failed: Guest Mode",error);
            setUser(null); // Explicitly set to null to stop loading
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    return () => { isMounted = false; };
  }, [setUser, setLoading, user]);

  if (loading) return <LoadingPage />;

  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route element={<RouteProtector isAllowed={!!user} />}>
        <Route element={<AdminDashboardLayout />}>
          <Route element={<RouteProtector isAllowed={user?.role === 'admin'} />}>
            <Route path='/admin/dashboard/user-Control' element={<UserControl />} />
            <Route path='/admin/dashboard/tariffs' element={<Tariffs />} />
          </Route>
          <Route element={<RouteProtector isAllowed={user?.role === 'admin' || user?.role === 'staff'}/>}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/dashboard/consumer-control' element={<ConsumerControl />} />
            <Route path='/dashboard/billing' element={<Billing />} />
            <Route path='/dashboard/payments' element={<Payments />} />
            <Route path='/dashboard/complaints' element={<Complaints />} />
            <Route path='/dashboard/settings' element={<Settings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;