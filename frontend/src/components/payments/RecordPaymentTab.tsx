import { useState, useCallback, useEffect } from 'react';
import billService from '../../services/bill.service';
import paymentService from '../../services/payment.service';
import type { Bill } from '../../services/bill.service';
import { formatCurrency, formatDate, MethodBadge, ErrorBanner, Pagination } from '../shared/ui';

// ─── Payment Receipt ──────────────────────────────────────────────────────────

interface Receipt {
    transactionId: string;
    amountPaid: number;
    paymentMethod: string;
    billMonth: string;
    billYear: number;
    consumerName: string;
}

interface ReceiptCardProps {
    receipt: Receipt;
    onDone: () => void;
}

export const PaymentReceiptCard: React.FC<ReceiptCardProps> = ({ receipt, onDone }) => (
    <div className="max-w-md mx-auto text-center space-y-6 py-6">
        <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
        </div>
        <div>
            <h3 className="text-2xl font-black text-zinc-100">Payment Recorded!</h3>
            <p className="text-zinc-500 text-sm mt-1">Transaction complete. Keep this receipt.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left space-y-3">
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Consumer</span><span className="text-zinc-200 font-semibold">{receipt.consumerName}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Period</span><span className="text-zinc-200">{receipt.billMonth} {receipt.billYear}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Method</span><MethodBadge method={receipt.paymentMethod} /></div>
            <div className="border-t border-zinc-800 pt-3 flex justify-between">
                <span className="text-zinc-400 font-bold">Amount Paid</span>
                <span className="text-emerald-400 font-black text-lg">{formatCurrency(receipt.amountPaid)}</span>
            </div>
            <div className="bg-zinc-800/60 rounded-xl p-3">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Transaction ID</p>
                <p className="text-sm font-mono text-zinc-300 break-all">{receipt.transactionId}</p>
            </div>
        </div>
        <button onClick={onDone} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all">
            Record Another Payment
        </button>
    </div>
);

// ─── Pending / Overdue Bill List + Payment Form ───────────────────────────────

const LIMIT = 10;

export const RecordPaymentTab: React.FC = () => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online' | 'other'>('cash');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [receipt, setReceipt] = useState<Receipt | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUnpaid, setTotalUnpaid] = useState(0);
    const [statusFilter, setStatusFilter] = useState<'pending' | 'overdue' | 'both'>('pending');

    const fetchBills = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                status: statusFilter === 'both' ? undefined : statusFilter,
                page,
                limit: LIMIT,
            };

            const queryStatus = statusFilter === 'both' ? undefined : statusFilter;
            const res = await billService.getAllBills({ ...params, status: queryStatus });

            setBills(res.data.bills);
            setTotalPages(res.data.pagination.totalPages);
            setTotalUnpaid(res.data.pagination.totalItems);
        } catch (e: any) {
            setError(e.response?.data?.message || 'Failed to fetch bills');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, page]);

    useEffect(() => {
        fetchBills();
    }, [fetchBills]);

    // Reset page when filter changes
    useEffect(() => {
        setPage(1);
    }, [statusFilter]);

    const handleRecord = async () => {
        if (!selectedBill) return;
        const consumer = selectedBill.consumerId as any;
        setSubmitting(true); setError(null);
        try {
            const res = await paymentService.recordPayment({
                billId: selectedBill._id,
                consumerId: typeof consumer === 'string' ? consumer : consumer._id,
                amountPaid: selectedBill.totalAmount,
                paymentMethod,
            });
            setReceipt({
                transactionId: res.data.transactionId,
                amountPaid: res.data.amountPaid,
                paymentMethod: res.data.paymentMethod,
                billMonth: selectedBill.billMonth,
                billYear: selectedBill.billYear,
                consumerName: typeof consumer === 'string' ? 'Consumer' : consumer.name,
            });
            setSelectedBill(null);
            fetchBills();
        } catch (e: any) {
            setError(e.response?.data?.message || 'Failed to record payment');
        } finally { 
            setSubmitting(false); 
        }
    };

    const [filteredBills, setFilteredBills] = useState(bills);

    useEffect(() => {
        setFilteredBills(bills.filter(b => {
            const c = b.consumerId as any;
            const name = (typeof c === 'string' ? '' : c?.name || '').toLowerCase();
            const meter = (typeof c === 'string' ? '' : c?.meterNumber || '').toLowerCase();
            return name.includes(search.toLowerCase()) || meter.includes(search.toLowerCase());
        }));
    }, [bills, search]);

    if (receipt) return <PaymentReceiptCard receipt={receipt} onDone={() => setReceipt(null)} />;

    return (
        <div className="space-y-6">
            <ErrorBanner message={error} onClear={() => setError(null)} />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left: Bill List */}
                <div className="lg:col-span-3 space-y-3">
                    {/* Search + Filter Bar */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search by consumer or meter..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-zinc-600" />
                        </div>
                        {/* Status Filter Tabs */}
                        <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1 shrink-0">
                            {([
                                { key: 'pending', label: 'Pending' },
                                { key: 'overdue', label: 'Overdue' },
                                { key: 'both', label: 'All' },
                            ] as const).map(({ key, label }) => (
                                <button key={key} onClick={() => { setStatusFilter(key); setSelectedBill(null); }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === key
                                        ? key === 'overdue' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
                                        : 'text-zinc-500 hover:text-zinc-200'}`}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bill List */}
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                Unpaid Bills &mdash; {totalUnpaid} total
                            </span>
                            {loading && <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-500" />}
                        </div>
                        <div className="max-h-[440px] overflow-y-auto divide-y divide-zinc-800/50 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600">
                            {loading && bills.length === 0 ? (
                                <div className="p-10 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto" /></div>
                            ) : filteredBills.length === 0 ? (
                                <div className="p-10 text-center text-zinc-600 text-sm">No unpaid bills found</div>
                            ) : filteredBills.map(bill => {
                                const consumer = bill.consumerId as any;
                                const isSelected = selectedBill?._id === bill._id;
                                const isOverdue = bill.status === 'overdue';
                                return (
                                    <button key={bill._id} onClick={() => setSelectedBill(isSelected ? null : bill)}
                                        className={`w-full text-left px-4 py-3.5 transition-all flex items-center gap-4 ${isSelected
                                            ? isOverdue ? 'bg-rose-500/10 border-l-2 border-l-rose-500' : 'bg-indigo-500/10 border-l-2 border-l-indigo-500'
                                            : 'hover:bg-zinc-800/30'
                                            }`}>
                                        <div className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center font-bold text-sm ${isOverdue ? 'bg-rose-500/10 text-rose-400' : 'bg-zinc-800 text-zinc-400'}`}>
                                            {(typeof consumer === 'string' ? '?' : consumer?.name?.charAt(0)?.toUpperCase()) || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-zinc-200 truncate">
                                                {typeof consumer === 'string' ? 'Unknown' : consumer?.name}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {bill.billMonth} {bill.billYear} &middot; Due {formatDate(bill.dueDate)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {isOverdue && (
                                                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">OVERDUE</span>
                                            )}
                                            <span className="text-sm font-bold text-zinc-200">{formatCurrency(bill.totalAmount)}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                    </div>
                </div>

                {/* Right: Payment Form */}
                <div className="lg:col-span-2">
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5 sticky top-6">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Record Payment</h3>
                        {!selectedBill ? (
                            <div className="text-center py-10 space-y-3">
                                <div className="h-16 w-16 rounded-2xl bg-zinc-800/60 flex items-center justify-center text-zinc-600 mx-auto">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                </div>
                                <p className="text-zinc-600 text-sm">Select a bill from the list</p>
                            </div>
                        ) : (
                            <>
                                {/* Selected Bill Summary */}
                                <div className={`rounded-xl p-4 space-y-2.5 ${(selectedBill.status === 'overdue') ? 'bg-rose-500/5 border border-rose-500/20' : 'bg-zinc-800/40'}`}>
                                    {selectedBill.status === 'overdue' && (
                                        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-1">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                            Overdue — was due {formatDate(selectedBill.dueDate)}
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm"><span className="text-zinc-500">Consumer</span><span className="text-zinc-200 font-semibold">{(selectedBill.consumerId as any)?.name || 'N/A'}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-zinc-500">Period</span><span className="text-zinc-300">{selectedBill.billMonth} {selectedBill.billYear}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-zinc-500">Units</span><span className="text-zinc-300">{selectedBill.unitsConsumed} kWh</span></div>
                                    <div className="border-t border-zinc-700/50 pt-2.5 flex justify-between">
                                        <span className="text-zinc-400 font-bold">Amount Due</span>
                                        <span className={`font-black text-lg ${selectedBill.status === 'overdue' ? 'text-rose-400' : 'text-amber-400'}`}>{formatCurrency(selectedBill.totalAmount)}</span>
                                    </div>
                                </div>

                                {/* Payment Method Selector */}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Payment Method</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['cash', 'card', 'online', 'other'] as const).map(m => (
                                            <button key={m} type="button" onClick={() => setPaymentMethod(m)}
                                                className={`py-2.5 rounded-xl text-sm font-bold capitalize transition-all border ${paymentMethod === m ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'}`}>
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={handleRecord} disabled={submitting}
                                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                                    {submitting
                                        ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/50" /><span>Processing...</span></>
                                        : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg><span>Confirm &mdash; {formatCurrency(selectedBill.totalAmount)}</span></>
                                    }
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

