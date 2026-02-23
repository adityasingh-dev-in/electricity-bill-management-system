import React from 'react';
import { Zap } from 'lucide-react';

const LoadingPage: React.FC = () => {
    return (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white overflow-hidden text-neutral-900">
            {/* Background Glows - Subtler for Light Theme */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-yellow-50/30 rounded-full blur-[100px] animate-pulse delay-700"></div>

            <div className="relative flex flex-col items-center">
                {/* Electricity / Circuit Ring */}
                <div className="relative flex items-center justify-center w-32 h-32">
                    {/* Inner Rotating Ring */}
                    <div className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-yellow-500/50 border-l-transparent rounded-full animate-spin"></div>

                    {/* Static Outer Ring */}
                    <div className="absolute inset-[-8px] border-2 border-dashed border-blue-100 rounded-full"></div>

                    {/* Lightning Icon with Glow */}
                    <div className="relative p-6 bg-blue-50 rounded-full border border-blue-100 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                        <Zap className="w-12 h-12 text-blue-600 fill-blue-600/10" />

                        {/* Spark particles */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-blue-500 rounded-full blur-[1px] animate-bounce"></div>
                        <div className="absolute bottom-1 right-2 w-1 h-2 bg-yellow-500 rounded-full blur-[1px] animate-pulse delay-300"></div>
                    </div>
                </div>

                {/* Text Section */}
                <div className="mt-8 flex flex-col items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-blue-500 animate-pulse">
                        STABILIZING GRID
                    </h2>
                    <div className="flex items-center gap-1 text-neutral-400 font-mono text-sm uppercase tracking-[0.3em]">
                        Linking power
                        <span className="flex gap-1 ml-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                        </span>
                    </div>
                </div>

                {/* Progress Bar (Simulated Charging) */}
                <div className="mt-12 w-64 h-1.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                    <div className="h-full bg-linear-to-r from-blue-600 via-blue-400 to-yellow-400 w-full -translate-x-full animate-[progress_2s_ease-in-out_infinite]"></div>
                </div>
            </div>

            <style>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default LoadingPage;
