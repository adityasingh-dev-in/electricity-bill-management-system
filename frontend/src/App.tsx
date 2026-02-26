import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Signup } from './pages/signup.page'
import { Login } from './pages/login.page'
import api from './utils/api'
import useUser from './hooks/useUser'
import ForgotPassword from './pages/ForgotPassword.page'
import { RouteProtector } from './utils/RouteProtector'
import AdminDashboardLayout from './layouts/adminDashboard.layout'
import { UserControl } from './pages/admin/UserControl'
import Dashboard from './pages/admin/Dashboard'
import ConsumerControl from './pages/admin/ConsumerControl'
import Tariffs from './pages/admin/Tariffs'
import Billing from './pages/admin/Billing'
import Payments from './pages/admin/Payments'
import Complaints from './pages/admin/Complaints'
import Settings from './pages/admin/Settings'
import LoadingPage from './components/LoadingPage'

import LandingPage from './pages/LandingPage'

async function fetchData() {
  const response = await api.get('/user/me');
  if (!response?.data) {
    throw new Error("User not found")
  }
  return response.data.data.user;
}

const App = () => {
  const { user, setUser, loading, setLoading } = useUser();
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true;

    // Only fetch if we don't have a user yet
    if (!user) {
      fetchData()
        .then((data) => {
          if (isMounted && data) {
            setUser(data);
          }
        })
        .catch((error) => {
          if (isMounted) {
            console.error("Auth initialization failed:", error);
            navigate('/login');
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [setUser, setLoading, navigate, user]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      {/* public routes */}
      <Route path='/' element={<LandingPage />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />

      <Route element={<RouteProtector isAllowed={!!user} />}>
        {/* Admin Routes */}
        <Route element={<RouteProtector isAllowed={user?.role === 'admin'} />}>
          <Route element={<AdminDashboardLayout />}>
            <Route path='/admin/dashboard' element={<Dashboard />} />
            <Route path='/admin/dashboard/user-Control' element={<UserControl />} />
            <Route path='/admin/dashboard/consumer-control' element={<ConsumerControl />} />
            <Route path='/admin/dashboard/tariffs' element={<Tariffs />} />
            <Route path='/admin/dashboard/billing' element={<Billing />} />
            <Route path='/admin/dashboard/payments' element={<Payments />} />
            <Route path='/admin/dashboard/complaints' element={<Complaints />} />
            <Route path='/admin/dashboard/settings' element={<Settings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App