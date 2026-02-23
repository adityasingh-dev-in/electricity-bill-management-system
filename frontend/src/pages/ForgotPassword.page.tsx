import { useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import api from '../utils/api';
import { type AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Mail, ShieldCheck, Lock, Loader2, KeyRound, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const navigate = useNavigate();

    const onSendOtp = async (data: FieldValues) => {
        setIsLoading(true);
        try {
            await api.post('/auth/send-otp', data);
            setEmail(data.email);
            toast.success('Verification code sent to your email!');
            setStep(2);
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage = axiosError.response?.data?.message || 'Failed to send OTP. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const onVerifyOtp = async (data: FieldValues) => {
        setIsLoading(true);
        try {
            await api.post('/auth/verify-otp', { email, otp: data.otp });
            toast.success('Code verified successfully!');
            setStep(3);
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage = axiosError.response?.data?.message || 'Invalid or expired code.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const onResetPassword = async (data: FieldValues) => {
        setIsLoading(true);
        try {
            await api.post('/auth/reset-password', {
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            });
            toast.success('Password reset successful! Please log in.');
            navigate('/login');
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage = axiosError.response?.data?.message || 'Failed to reset password.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="absolute top-0 z-10 w-full min-h-screen bg-neutral-50 flex items-center justify-center p-4 selection:bg-blue-100 text-neutral-900">
            <div className="w-full max-w-md">
                {/* Progress Indicator */}
                <div className="flex justify-center mb-8 gap-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-600' : 'bg-neutral-200'
                                }`}
                        />
                    ))}
                </div>

                {/* Minimal Card */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                    <div className="relative z-10 mb-8 text-center">
                        {step === 1 && (
                            <>
                                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                                    Forgot Password?
                                </h1>
                                <p className="text-neutral-500 text-sm">Enter your email and we'll send reset instructions.</p>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                                    Check Email
                                </h1>
                                <p className="text-neutral-500 text-sm">Enter the 6-digit code sent to your inbox.</p>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                                    New Password
                                </h1>
                                <p className="text-neutral-500 text-sm">Secure your account with a strong password.</p>
                            </>
                        )}
                    </div>

                    <div className="relative z-10">
                        {step === 1 && (
                            <form onSubmit={handleSubmit(onSendOtp)} className="space-y-6">
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

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-neutral-900 text-white py-3 rounded-xl font-semibold hover:bg-neutral-800 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-neutral-200"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                                        ) : (
                                            <>
                                                Send Code
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleSubmit(onVerifyOtp)} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 ml-1">Verification Code</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <ShieldCheck className="h-4 w-4 text-neutral-400" />
                                        </div>
                                        <input
                                            {...register('otp', {
                                                required: 'Code is required',
                                                minLength: { value: 6, message: 'OTP must be 6 digits' },
                                                maxLength: { value: 6, message: 'OTP must be 6 digits' }
                                            })}
                                            type="text"
                                            placeholder="000000"
                                            maxLength={6}
                                            className="block w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-neutral-900 placeholder:text-neutral-400 tracking-[0.5em] font-mono text-center text-sm"
                                        />
                                    </div>
                                    {errors.otp && <p className="mt-1 text-xs text-rose-500 ml-1">{errors.otp.message as string}</p>}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-neutral-900 text-white py-3 rounded-xl font-semibold hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-neutral-400" /> : 'Verify Code'}
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-700 transition-colors flex items-center justify-center gap-2 font-medium"
                                    >
                                        <ArrowLeft className="h-3 w-3" />
                                        Change Email
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleSubmit(onResetPassword)} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 ml-1">New Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-neutral-400" />
                                        </div>
                                        <input
                                            {...register('newPassword', {
                                                required: 'Password is required',
                                                minLength: { value: 6, message: 'Minimum 6 characters' }
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
                                    {errors.newPassword && <p className="mt-1 text-xs text-rose-500 ml-1">{errors.newPassword.message as string}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 ml-1">Confirm Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <KeyRound className="h-4 w-4 text-neutral-400" />
                                        </div>
                                        <input
                                            {...register('confirmPassword', {
                                                required: 'Please confirm your password',
                                                validate: (val: string) => {
                                                    if (watch('newPassword') !== val) {
                                                        return "Passwords do not match";
                                                    }
                                                },
                                            })}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className="block w-full pl-11 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-neutral-900 placeholder:text-neutral-400 text-sm"
                                        />
                                    </div>
                                    {errors.confirmPassword && <p className="mt-1 text-xs text-rose-500 ml-1">{errors.confirmPassword.message as string}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-neutral-900 text-white py-3 rounded-xl font-semibold hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-neutral-400" /> : 'Reset Password'}
                                    </span>
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="mt-10 text-center relative z-10 border-t border-neutral-100 pt-8">
                        <p className="text-neutral-500 text-sm">
                            Remembered your password?{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
