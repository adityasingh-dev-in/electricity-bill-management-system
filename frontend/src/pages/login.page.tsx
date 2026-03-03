import { useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import api from '../utils/api';
import { type AxiosError } from 'axios';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useUser from '../hooks/useUser';
import toast from 'react-hot-toast';

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { setUser } = useUser();

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const userData = response.data?.data?.user;

      if (userData) {
        setUser(userData);
        toast.success('Logged in successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Invalid email or password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 z-0" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 transform transition-all duration-500 hover:scale-105">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4 backdrop-blur-xl">
            <Lock className="h-8 w-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-neutral-400 font-medium">Manage your utilities with ease</p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-300 ml-1">Email Address</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-500 group-focus-within/input:text-indigo-400 transition-colors" />
                </div>
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  placeholder="name@company.com"
                  className="block w-full pl-12 pr-4 py-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-neutral-600 text-sm font-medium"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-400 font-semibold ml-1">{errors.email.message as string}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-neutral-300">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-500 group-focus-within/input:text-indigo-400 transition-colors" />
                </div>
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-12 py-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-neutral-600 text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-400 font-semibold ml-1">{errors.password.message as string}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed pt-2"
            >
              <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 overflow-hidden shadow-xl group-hover:bg-indigo-500 transition-colors">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-10 text-center relative z-10 border-t border-neutral-800 pt-8">
            <p className="text-neutral-400 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
        {/* Footer info */}
        <p className="mt-8 text-center text-neutral-500 text-xs font-medium px-4">
          Secure enterprise-grade encryption enabled. Your data's safety is our top priority.
        </p>
      </div>
    </div>
  );
};
