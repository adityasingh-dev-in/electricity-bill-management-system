import { useState, useEffect, useCallback } from 'react';
import paymentService from '../../services/payment.service';
import type { Payment } from '../../services/payment.service';
import { formatCurrency, formatDateTime, MethodBadge, SkeletonRow, ErrorBanner, Pagination } from '../shared/ui';

const LIMIT = 12;

export const RevenueFeedTab: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fetchPayments = useCallback(async (p: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await paymentService.getAllPayments({ page: p, limit: LIMIT });
            setPayments(res.data.payments);
            setTotalPages(res.data.pagination.totalPages);
            setTotalItems(res.data.pagination.totalItems);
        } catch (e: any) {
            setError(e.response?.data?.message || 'Failed to fetch payments');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPayments(page);
    }, [fetchPayments, page]);

    const pageRevenue = payments.reduce((s, p) => s + p.amountPaid, 0);
    const methodBreakdown = payments.reduce((acc, p) => {
        acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const topMethod = Object.entries(methodBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0];

    return (
        <div className="space-y-5">
            <ErrorBanner message={error} onClear={() => setError(null)} />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Page Revenue</p>
                    <p className="text-2xl font-black text-emerald-400">{formatCurrency(pageRevenue)}</p>
                    <p className="text-xs text-zinc-600 mt-1">{payments.length} shown transactions</p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Total Transactions</p>
                    <p className="text-2xl font-black text-zinc-100">{totalItems}</p>
                    <p className="text-xs text-zinc-600 mt-1">All time in system</p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Top Method (Page)</p>
                    <div className="mt-2">{topMethod ? <MethodBadge method={topMethod} /> : <p className="text-zinc-600 text-sm">—</p>}</div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">All Transactions</p>
                    <button onClick={() => fetchPayments(page)} title="Refresh"
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-all">
                        <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left">
                                {['Consumer', 'Transaction ID', 'Method', 'Amount', 'Date'].map(h => (
                                    <th key={h} className="px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading
                                ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonRow key={i} cols={5} />)
                                : payments.length === 0
                                    ? <tr><td colSpan={5} className="text-center py-16 text-zinc-600 text-sm">No payments recorded yet</td></tr>
                                    : payments.map(p => {
                                        const consumer = p.consumerId as any;
                                        const bill = p.billId as any;
                                        return (
                                            <tr key={p._id} className="border-t border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                                                <td className="px-4 py-3.5">
                                                    <p className="text-sm font-semibold text-zinc-200">{typeof consumer === 'string' ? 'N/A' : consumer?.name || 'N/A'}</p>
                                                    <p className="text-xs text-zinc-600">{bill?.billMonth} {bill?.billYear}</p>
                                                </td>
                                                <td className="px-4 py-3.5 font-mono text-xs text-zinc-500 max-w-[160px]">
                                                    <span className="truncate block">{p.transactionId}</span>
                                                </td>
                                                <td className="px-4 py-3.5"><MethodBadge method={p.paymentMethod} /></td>
                                                <td className="px-4 py-3.5 text-sm font-bold text-emerald-400">{formatCurrency(p.amountPaid)}</td>
                                                <td className="px-4 py-3.5 text-xs text-zinc-500">{formatDateTime(p.createdAt)}</td>
                                            </tr>
                                        );
                                    })
                            }
                        </tbody>
                    </table>
                </div>

                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
        </div>
    );
};

