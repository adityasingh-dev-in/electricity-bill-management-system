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
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 selection:bg-indigo-500/30 overflow-hidden relative">
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 z-0" />

            <div className="w-full max-w-md relative z-10">
                {/* Brand/Logo Area */}
                <div className="text-center mb-8 transform transition-all duration-500 hover:scale-105">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4 backdrop-blur-xl">
                        <KeyRound className="h-8 w-8 text-indigo-400" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">
                        {step === 1 ? 'Reset Password' : step === 2 ? 'Verify OTP' : 'New Password'}
                    </h1>
                    <p className="text-neutral-400 font-medium">
                        {step === 1 ? "We'll help you get back into your account" : step === 2 ? `A code was sent to ${email}` : 'Create a secure new password'}
                    </p>
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center mb-6 gap-2">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-indigo-500' : 'w-4 bg-neutral-800'}`}
                        />
                    ))}
                </div>

                {/* glass-card from index.css */}
                <div className="glass-card rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        {step === 1 && (
                            <form onSubmit={handleSubmit(onSendOtp)} className="space-y-6">
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

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full relative group transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed pt-2"
                                >
                                    <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition duration-300" />
                                    <div className="relative w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 overflow-hidden shadow-xl group-hover:bg-indigo-500 transition-colors">
                                        {isLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                <span>Send Recovery Code</span>
                                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleSubmit(onVerifyOtp)} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-300 ml-1">Verification Code</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <ShieldCheck className="h-5 w-5 text-neutral-500 group-focus-within/input:text-indigo-400 transition-colors" />
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
                                            className="block w-full pl-11 pr-4 py-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-neutral-600 tracking-[0.5em] font-mono text-center text-lg font-bold"
                                        />
                                    </div>
                                    {errors.otp && <p className="mt-1 text-xs text-rose-400 font-semibold ml-1">{errors.otp.message as string}</p>}
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full relative group transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed pt-2"
                                    >
                                        <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition duration-300" />
                                        <div className="relative w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 overflow-hidden shadow-xl group-hover:bg-indigo-500 transition-colors">
                                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify & Continue'}
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-full py-2 text-sm text-neutral-400 hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 font-bold"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Change Email
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleSubmit(onResetPassword)} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-300 ml-1">New Password</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-neutral-500 group-focus-within/input:text-indigo-400 transition-colors" />
                                        </div>
                                        <input
                                            {...register('newPassword', {
                                                required: 'Password is required',
                                                minLength: { value: 6, message: 'Minimum 6 characters' }
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
                                    {errors.newPassword && <p className="mt-1 text-xs text-rose-400 font-semibold ml-1">{errors.newPassword.message as string}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-300 ml-1">Confirm Password</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <KeyRound className="h-5 w-5 text-neutral-500 group-focus-within/input:text-indigo-400 transition-colors" />
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
                                            className="block w-full pl-12 pr-12 py-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-neutral-600 text-sm font-medium"
                                        />
                                    </div>
                                    {errors.confirmPassword && <p className="mt-1 text-xs text-rose-400 font-semibold ml-1">{errors.confirmPassword.message as string}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full relative group transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed pt-2"
                                >
                                    <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition duration-300" />
                                    <div className="relative w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 overflow-hidden shadow-xl group-hover:bg-indigo-500 transition-colors">
                                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Set New Password'}
                                    </div>
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Back to Login */}
                    <div className="mt-10 text-center relative z-10 border-t border-neutral-800 pt-8">
                        <p className="text-neutral-400 font-medium">
                            Remembered your password?{' '}
                            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
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
