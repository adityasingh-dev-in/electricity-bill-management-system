import { useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import api from '../utils/api';
import { type AxiosError } from 'axios';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useUser from '../hooks/useUser';

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { setUser } = useUser()

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      setUser(response?.data?.data)
      alert(response.data.message || 'Login successful!');
      navigate('/');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Something went wrong. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute top-0 z-10 w-full min-h-screen bg-neutral-50 flex items-center justify-center p-4 selection:bg-blue-100">
      <div className="w-full max-w-md">
        {/* Minimal Card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <div className="relative z-10 text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Login
            </h1>
            <p className="text-neutral-500 text-sm">Welcome back to Electricity Management</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  placeholder="name@company.com"
                  className="block w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-neutral-900 placeholder:text-neutral-400 text-sm"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-500 ml-1">{errors.email.message as string}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-neutral-900 placeholder:text-neutral-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-500 ml-1">{errors.password.message as string}</p>}
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" hidden className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neutral-900 text-white py-3 rounded-xl font-semibold hover:bg-neutral-800 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-neutral-200"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                    <span className="text-neutral-400">Verifying...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </span>
            </button>
          </form>

          {/* signup Link */}
          <div className="mt-10 text-center relative z-10 border-t border-neutral-100 pt-8">
            <p className="text-neutral-500 text-sm">
              New here?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Create an account
              </Link>
            </p>
            <div className="mt-4">
              <Link to="/forgot-password" title='Forgot Password' className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                Having trouble signing in?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
