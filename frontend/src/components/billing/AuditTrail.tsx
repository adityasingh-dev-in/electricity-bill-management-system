import { useState, useCallback, useEffect } from 'react';
import billService from '../../services/bill.service';
import type { Bill } from '../../services/bill.service';
import { formatCurrency, formatDate, StatusBadge, SkeletonRow, ErrorBanner, Pagination } from '../shared/ui';
import { MONTHS } from './GenerateTab';

// ... (BillRow component remains the same, but let's ensure it's imported or defined if needed)
// I'll keep the BillRow as it was in the file, but I need to make sure I don't break it.
// Assuming BillRow is defined as it was before.

// ─── Single Row ───────────────────────────────────────────────────────────────

interface BillRowProps {
    bill: Bill;
    isAdmin: boolean;
    onDelete: (id: string) => void;
    onUpdateStatus: (id: string, status: string) => void;
}

export const BillRow: React.FC<BillRowProps> = ({ bill, isAdmin, onDelete, onUpdateStatus }) => {
    const consumer = bill.consumerId as any;
    const [pdfLoading, setPdfLoading] = useState(false);

    const handlePDF = async () => {
        setPdfLoading(true);
        try {
            const blob = await billService.getBillPDF(bill._id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.setAttribute('download', `Bill_${bill._id}.pdf`);
            document.body.appendChild(a); a.click(); a.remove();
        } finally { setPdfLoading(false); }
    };

    return (
        <tr className="border-t border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
            <td className="px-4 py-3.5">
                <p className="text-sm font-semibold text-zinc-200">{consumer?.name || 'N/A'}</p>
                <p className="text-xs text-zinc-500">{consumer?.meterNumber || ''}</p>
            </td>
            <td className="px-4 py-3.5 text-sm text-zinc-400">{bill.billMonth} {bill.billYear}</td>
            <td className="px-4 py-3.5 text-sm font-bold text-zinc-200">{formatCurrency(bill.totalAmount)}</td>
            <td className="px-4 py-3.5 text-sm text-zinc-500">{formatDate(bill.dueDate)}</td>
            <td className="px-4 py-3.5"><StatusBadge status={bill.status} /></td>
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-1.5">
                    <button onClick={handlePDF} disabled={pdfLoading} title="Download PDF"
                        className="p-2 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                        {pdfLoading
                            ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500" />
                            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                        }
                    </button>
                    {isAdmin && bill.status === 'pending' && (
                        <button onClick={() => onUpdateStatus(bill._id, 'paid')} title="Mark as Paid"
                            className="p-2 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                    )}
                    {isAdmin && bill.status === 'pending' && (
                        <button onClick={() => onDelete(bill._id)} title="Delete Bill"
                            className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

// ... (AuditTrail)

interface AuditTrailProps {
    isAdmin: boolean;
}

const LIMIT = 10;

export const AuditTrail: React.FC<AuditTrailProps> = ({ isAdmin }) => {
    const [scope, setScope] = useState<'all' | 'my'>('all');
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ status: '', month: '', year: '' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const fetchBills = useCallback(async (s = scope, f = filters, p = page) => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                status: f.status || undefined,
                month: f.month || undefined,
                year: f.year ? Number(f.year) : undefined,
                page: p,
                limit: LIMIT,
            };
            const res = s === 'all'
                ? await billService.getAllBills(params)
                : await billService.getMyBills(params);

            setBills(res.data.bills);
            setTotalPages(res.data.pagination.totalPages);
        } catch (e: any) {
            setError(e.response?.data?.message || 'Failed to fetch bills');
        } finally {
            setLoading(false);
        }
    }, [scope, filters, page]);

    useEffect(() => {
        fetchBills();
    }, [fetchBills]);

    const handleScopeChange = (s: 'all' | 'my') => {
        setScope(s);
        setPage(1);
    };

    const handleFilter = (k: string, v: string) => {
        setFilters(prev => ({ ...prev, [k]: v }));
        setPage(1);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this bill and its meter reading?')) return;
        setError(null);
        try {
            await billService.deleteBill(id);
            fetchBills();
        } catch (e: any) {
            setError(e.response?.data?.message || 'Delete failed');
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        setError(null);
        try {
            await billService.updateBillStatus(id, status);
            fetchBills();
        } catch (e: any) {
            setError(e.response?.data?.message || 'Update failed');
        }
    };

    return (
        <div className="space-y-4">
            <ErrorBanner message={error} onClear={() => setError(null)} />

            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl gap-1 w-fit">
                    {(['all', 'my'] as const).map(s => (
                        <button key={s} onClick={() => handleScopeChange(s)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${scope === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:text-zinc-200'}`}>
                            {s === 'all' ? 'All Bills' : 'My Bills'}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                    <select value={filters.status} onChange={e => handleFilter('status', e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                    </select>
                    <select value={filters.month} onChange={e => handleFilter('month', e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option value="">All Months</option>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <input type="number" value={filters.year} onChange={e => handleFilter('year', e.target.value)}
                        placeholder="Year" className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-24" />
                    <button onClick={() => fetchBills()} className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all" title="Refresh">
                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left">
                                {['Consumer', 'Period', 'Amount', 'Due Date', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading
                                ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonRow key={i} cols={6} />)
                                : bills.length === 0
                                    ? <tr><td colSpan={6} className="text-center py-16 text-zinc-600 text-sm">No bills found</td></tr>
                                    : bills.map(b => (
                                        <BillRow
                                            key={b._id} bill={b} isAdmin={isAdmin}
                                            onDelete={handleDelete} onUpdateStatus={handleUpdateStatus}
                                        />
                                    ))
                            }
                        </tbody>
                    </table>
                </div>

                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
        </div>
    );
};

