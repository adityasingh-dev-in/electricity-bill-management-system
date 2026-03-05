import React from 'react';
import {
    AlertTriangle,
    ArrowRight,
    MapPin} from 'lucide-react';
import { formatCurrency } from '../../../components/shared/ui';
import type { OutstandingBill } from '../../../services/dashboard.service';

interface OutstandingBillsProps {
    bills: OutstandingBill[];
    loading: boolean;
}

const OutstandingBills: React.FC<OutstandingBillsProps> = ({ bills, loading }) => {
    if (loading) {
        return (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden animate-pulse p-6">
                <div className="h-4 w-32 bg-zinc-800 rounded mb-6"></div>
                {[1, 2, 3, 5].map((i) => (
                    <div key={i} className="h-12 w-full bg-zinc-800/50 rounded mb-3"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <AlertTriangle size={18} className="text-amber-500" />
                        Unpaid Collections
                    </h3>
                    <p className="text-zinc-500 text-xs mt-1 font-medium">Top high-risk outstanding bills by aging days.</p>
                </div>
                <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    View All <ArrowRight size={14} />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-zinc-950/20">
                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none">Consumer</th>
                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none">Area</th>
                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none">Amount</th>
                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none text-right">Aging</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {bills.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-zinc-600 font-bold text-sm">
                                    No outstanding bills found.
                                </td>
                            </tr>
                        ) : (
                            bills.slice(0, 5).map((bill) => (
                                <tr key={bill._id} className="hover:bg-zinc-800/20 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{bill.consumer.name}</span>
                                            <span className="text-xs text-zinc-500 font-medium mt-0.5 flex items-center gap-1">
                                                <div className="w-1 h-1 rounded-full bg-zinc-700" />
                                                #{bill.consumer.meterNumber}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-zinc-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                                            <MapPin size={12} className="text-zinc-600" />
                                            {bill.consumer.area}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">{formatCurrency(bill.totalAmount)}</span>
                                            <span className="text-[10px] text-zinc-500 font-bold mt-0.5">{bill.billMonth} {bill.billYear}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${bill.agingDays > 30 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                            }`}>
                                            {bill.agingDays} Days Overdue
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OutstandingBills;
