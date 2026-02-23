import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Signup } from './pages/signup.page'
import { Login } from './pages/login.page'
import api from './utils/api'
import useUser from './hooks/useUser'
import ForgotPassword from './pages/ForgotPassword.page'
import { RouteProtector } from './utils/RouteProtector'
import AdminDashboardLayout from './layouts/adminDashboard.layout'
import { UserControl } from './pages/admin/UserControl'
import LoadingPage from './components/LoadingPage'


async function fetchData() {
  const response = await api.get('/user/me');
  if (!response?.data) {
    throw new Error("User not found")
  }
  return response.data.data.user;
}

const App = () => {
  const { user, setUser, loading, setLoading } = useUser();
  useEffect(() => {
    setLoading(true);
    fetchData().then((data) => {
      if (data) {
        setUser(data);
        console.log(data)
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [setUser, setLoading]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      {/* public routes */}
      <Route path='/' element={<h1>{user?.name}</h1>} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />

      <Route element={<RouteProtector isAllowed={!!user} />}>
        {/* Admin Routes */}
        <Route element={<RouteProtector isAllowed={user?.role === 'admin'} />}>
          <Route element={<AdminDashboardLayout />}>
            <Route path='/admin/dashboard/user-Control' element={<UserControl />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App