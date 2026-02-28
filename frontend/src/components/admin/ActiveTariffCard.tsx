import React from 'react';
import { Zap, DollarSign, Clock, ShieldCheck } from 'lucide-react';
import type { TariffData } from '../../services/tariff.service';

interface ActiveTariffCardProps {
    tariff: TariffData | null;
    loading: boolean;
}

const ActiveTariffCard: React.FC<ActiveTariffCardProps> = ({ tariff, loading }) => {
    if (loading) {
        return (
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl animate-pulse">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-neutral-800 rounded-xl h-12 w-12"></div>
                    <div className="h-6 w-32 bg-neutral-800 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="h-3 w-20 bg-neutral-800 rounded"></div>
                        <div className="h-6 w-24 bg-neutral-800 rounded"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-20 bg-neutral-800 rounded"></div>
                        <div className="h-6 w-24 bg-neutral-800 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!tariff) {
        return (
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-rose-500/10 rounded-xl mb-4">
                    <Zap className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">No Active Tariff</h3>
                <p className="text-neutral-400 text-sm">Please create or activate a tariff plan.</p>
            </div>
        );
    }

    return (
        <div className="relative p-6 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 shadow-xl shadow-black/20">
            {/* Background Accent */}
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-colors duration-500"></div>

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600/10 rounded-xl">
                        <Zap className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Active Plan</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider">Current Live Rates</span>
                        </div>
                    </div>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Active</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-neutral-400">
                        <DollarSign className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium uppercase tracking-wider">Rate per Unit</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white leading-tight"> ₹{tariff.ratePerUnit}</span>
                        <span className="text-sm font-medium text-neutral-500">/kWh</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-neutral-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium uppercase tracking-wider">Fixed Charge</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white leading-tight"> ₹{tariff.fixedCharge}</span>
                        <span className="text-sm font-medium text-neutral-500">/mo</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800/50 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Last Updated</span>
                    <span className="text-xs text-neutral-300 font-medium">
                        {new Date(tariff.updatedAt || tariff.createdAt || '').toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </span>
                </div>
                <div className="text-[10px] font-mono text-neutral-600 uppercase">
                    ID: {tariff._id?.slice(-8)}
                </div>
            </div>
        </div>
    );
};

export default ActiveTariffCard;
