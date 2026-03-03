import { useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import api from '../utils/api';
import { type AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', data);
      toast.success(response.data.message || 'Signup successful!');
      navigate('/login');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Something went wrong. Please try again.';
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
        {/* Brand/Logo Area */}
        <div className="text-center mb-8 transform transition-all duration-500 hover:scale-105">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4 backdrop-blur-xl">
            <User className="h-8 w-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            Create Account
          </h1>
          <p className="text-neutral-400 font-medium">Join the next-gen utility management</p>
        </div>

        {/* glass-card from index.css */}
        <div className="glass-card rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-300 ml-1">Full Name</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-500 group-focus-within/input:text-indigo-400 transition-colors" />
                </div>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  placeholder="John Doe"
                  className="block w-full pl-12 pr-4 py-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-neutral-600 text-sm font-medium"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-rose-400 font-semibold ml-1">{errors.name.message as string}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-300 ml-1">Email Address</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-500 group-focus-within/input:text-indigo-400 transition-colors" />
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
                  className="block w-full pl-12 pr-4 py-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-neutral-600 text-sm font-medium"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-400 font-semibold ml-1">{errors.email.message as string}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-300 ml-1">Password</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-500 group-focus-within/input:text-indigo-400 transition-colors" />
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

            {/* Submit Button */}
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-10 text-center relative z-10 border-t border-neutral-800 pt-8">
            <p className="text-neutral-400 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-neutral-500 text-xs font-semibold px-4 opacity-70">
          Secure enterprise-grade encryption enabled.
        </p>
      </div>
    </div>
  );
};
