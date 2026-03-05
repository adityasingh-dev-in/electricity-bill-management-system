import React, { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    RefreshCcw,
    Search,
    Activity,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import dashboardService, {
    type MonthlySummary,
    type OutstandingBill
} from '../../services/dashboard.service';

import SummaryCards from './components/SummaryCards';
import OutstandingBills from './components/OutstandingBills';
import { ErrorBanner } from '../../components/shared/ui';

const Dashboard = () => {
    const [summary, setSummary] = useState<MonthlySummary | null>(null);
    const [outstanding, setOutstanding] = useState<OutstandingBill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    // Consumer 360 Search State
    const [searchId, setSearchId] = useState('');
    const [searching, setSearching] = useState(false);
    const [consumerSummary, setConsumerSummary] = useState<any | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId) return;
        try {
            setSearching(true);
            const data = await dashboardService.getConsumerSummary(searchId);
            setConsumerSummary(data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Consumer not found");
        } finally {
            setSearching(false);
        }
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [summaryData, outstandingData] = await Promise.all([
                dashboardService.getMonthlySummary(),
                dashboardService.getOutstanding()
            ]);

            setSummary(summaryData);
            setOutstanding(outstandingData);
            setLastUpdated(new Date());

        } catch (err: any) {
            console.error("Dashboard error:", err);
            const msg = err.response?.data?.message || "Failed to load dashboard data";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                            <LayoutDashboard size={18} />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Main Dashboard</h1>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium">
                        Last synced: <span className="text-zinc-400 font-bold">{lastUpdated.toLocaleTimeString()}</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchDashboardData}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white text-xs font-bold transition-all disabled:opacity-50"
                    >
                        <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
                        Refresh Data
                    </button>

                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest font-black text-emerald-500/60">Live Analytics</span>
                    </div>
                </div>
            </div>

            <ErrorBanner message={error} onClear={() => setError(null)} />

            {/* Quick Summary Cards */}
            <SummaryCards summary={summary} loading={loading} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <div className="xl:col-span-2 space-y-6">
                    <OutstandingBills bills={outstanding} loading={loading} />


                </div>

                {/* Sidebar: Outstanding & Quick Actions */}
                <div className="space-y-6">
                    {/* Consumer 360 Search */}
                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                        <h4 className="text-sm font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-zinc-500">
                            <Search size={14} className="text-indigo-400" />
                            Consumer 360
                        </h4>
                        <form onSubmit={handleSearch} className="space-y-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Consumer ID..."
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700"
                                />
                                {searching && (
                                    <div className="absolute right-3 top-3">
                                        <RefreshCcw size={16} className="text-zinc-600 animate-spin" />
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={searching || !searchId}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20"
                            >
                                Fetch History
                            </button>
                        </form>

                        {consumerSummary && (
                            <div className="mt-6 pt-6 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                                        {consumerSummary.consumer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white leading-tight">{consumerSummary.consumer.name}</p>
                                        <p className="text-[10px] text-zinc-500 font-medium">Meter: {consumerSummary.consumer.meterNumber}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="p-2 bg-zinc-800/30 rounded-lg">
                                        <p className="text-[8px] uppercase text-zinc-600 font-bold mb-0.5">Total Billed</p>
                                        <p className="text-xs font-bold text-white">₹{consumerSummary.stats.totalBilled?.toLocaleString() || 0}</p>
                                    </div>
                                    <div className="p-2 bg-zinc-800/30 rounded-lg">
                                        <p className="text-[8px] uppercase text-zinc-600 font-bold mb-0.5">Avg Units</p>
                                        <p className="text-xs font-bold text-emerald-400">{Math.round(consumerSummary.stats.avgMonthlyUnits || 0)} kWh</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setConsumerSummary(null)}
                                    className="w-full py-2 text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest"
                                >
                                    Clear Result
                                </button>
                            </div>
                        )}
                    </div>

                                        {/* Secondary Insights Row */}
                    <div className="grid grid-cols-1 md:grid-cols-0 gap-6">
                        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                            <h4 className="text-sm font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-zinc-500">
                                <Activity size={14} className="text-indigo-400" />
                                Efficiency Metrics
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                                        <span className="text-zinc-500">Collection Efficiency</span>
                                        <span className="text-emerald-400">
                                            {summary ? Math.round((summary.totalCollected / (summary.totalBilled || 1)) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-1000"
                                            style={{ width: `${summary ? (summary.totalCollected / (summary.totalBilled || 1)) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                                        <span className="text-zinc-500">System Uptime</span>
                                        <span className="text-blue-400">99.8%</span>
                                    </div>
                                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-1000"
                                            style={{ width: `99.8%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20">
                                    <AlertCircle size={14} />
                                </div>
                                <span className="text-xs font-bold text-zinc-400">Pending Actions</span>
                            </div>
                            <p className="text-2xl font-black text-white">{summary?.pendingBills || 0}</p>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter mt-1">
                                Unreviewed bills require status updates
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
