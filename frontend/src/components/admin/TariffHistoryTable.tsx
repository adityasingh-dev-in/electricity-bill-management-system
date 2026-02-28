import React from 'react';
import { Edit2, CheckCircle2, History, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TariffData } from '../../services/tariff.service';

interface TariffHistoryTableProps {
    tariffs: TariffData[];
    loading: boolean;
    page: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
    onEdit: (tariff: TariffData) => void;
    onActivate: (id: string) => void;
}

const TariffHistoryTable: React.FC<TariffHistoryTableProps> = ({
    tariffs,
    loading,
    page,
    total,
    limit,
    onPageChange,
    onEdit,
    onActivate
}) => {
    const totalPages = Math.ceil(total / limit);

    if (loading && tariffs.length === 0) {
        return (
            <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-neutral-400 font-medium">Loading tariff history...</p>
            </div>
        );
    }

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600/10 rounded-lg">
                        <History className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white leading-none">Tariff History</h3>
                        <p className="text-xs text-neutral-500 mt-1.5">Manage and track previous tariff versions</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-neutral-800 rounded-md text-[10px] font-bold text-neutral-400 uppercase tracking-widest border border-neutral-700/50">
                    Total: {total}
                </div>
            </div>

            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-950/50">
                            <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-800">Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-800">Rate / Unit</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-800">Fixed Charge</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-800">Created Date</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-800 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                        {tariffs.map((t) => (
                            <tr key={t._id} className={`group hover:bg-neutral-800/30 transition-colors ${t.isActive ? 'bg-indigo-500/5' : ''}`}>
                                <td className="px-6 py-4">
                                    {t.isActive ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Active</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-neutral-600"></div>
                                            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Inactive</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">₹{t.ratePerUnit}</span>
                                        <span className="text-[10px] text-neutral-500 font-medium">per kWh</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">₹{t.fixedCharge}</span>
                                        <span className="text-[10px] text-neutral-500 font-medium">per month</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-neutral-400 font-medium whitespace-nowrap">
                                        {new Date(t.createdAt || '').toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {!t.isActive && (
                                            <>
                                                <button
                                                    onClick={() => onActivate(t._id!)}
                                                    className="p-2 text-neutral-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all border border-transparent hover:border-indigo-500/20"
                                                    title="Activate Plan"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => onEdit(t)}
                                                    className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all border border-transparent hover:border-amber-500/20"
                                                    title="Edit Plan"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                        {t.isActive && (
                                            <div className="p-2 text-neutral-600 italic text-[10px] font-medium tracking-tight">
                                                Active Version
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View: Card-based layout */}
            <div className="md:hidden divide-y divide-neutral-800">
                {tariffs.map((t) => (
                    <div key={t._id} className={`p-4 space-y-4 ${t.isActive ? 'bg-indigo-500/5' : ''}`}>
                        <div className="flex items-center justify-between">
                            {t.isActive ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-neutral-600"></div>
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Inactive</span>
                                </div>
                            )}
                            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                                {new Date(t.createdAt || '').toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short'
                                })}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Rate</span>
                                <span className="text-base font-bold text-white">₹{t.ratePerUnit} /kWh</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Fixed</span>
                                <span className="text-base font-bold text-white">₹{t.fixedCharge} /mo</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800/50">
                            {!t.isActive ? (
                                <>
                                    <button
                                        onClick={() => onEdit(t)}
                                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-xl transition-all active:scale-95"
                                    >
                                        <Edit2 className="h-3.5 w-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onActivate(t._id!)}
                                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 border border-indigo-500/20 rounded-xl transition-all shadow-lg shadow-indigo-600/10 active:scale-95"
                                    >
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Activate
                                    </button>
                                </>
                            ) : (
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] py-2 px-4 bg-indigo-500/10 rounded-xl">
                                    Active Live Version
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-medium">
                    Showing Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{totalPages}</span>
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1 || loading}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg border border-neutral-700 transition-all"
                    >
                        <ChevronLeft className="h-4 w-4 text-white" />
                    </button>
                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages || loading}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg border border-neutral-700 transition-all"
                    >
                        <ChevronRight className="h-4 w-4 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TariffHistoryTable;
