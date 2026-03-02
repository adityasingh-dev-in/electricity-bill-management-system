import { useState } from 'react';
import billService from '../../services/bill.service';
import type { Bill } from '../../services/bill.service';
import paymentService from '../../services/payment.service';
import type { Payment } from '../../services/payment.service';
import { formatCurrency, formatDate, MethodBadge, ErrorBanner, StatusBadge } from '../shared/ui';
import { Search, History, CreditCard, Receipt, TrendingUp } from 'lucide-react';

export const ConsumerHistoryTab: React.FC = () => {
    const [consumerId, setConsumerId] = useState('');
    const [bills, setBills] = useState<Bill[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        const id = consumerId.trim();
        if (!id) return;
        
        setLoading(true); 
        setError(null); 
        setSearched(false);

        try {
            const [billRes, payRes] = await Promise.all([
                // We pass a high limit here because the History Tab usually 
                // wants a "full" overview rather than small pages
                billService.getConsumerBillHistory(id, { page: 1, limit: 50 }),
                paymentService.getPaymentHistoryByConsumer(id),
            ]);

            // FIX: Access .bills from the new paginated response structure
            setBills(billRes.data.bills || []); 
            setPayments(payRes.data.payments || []);
            setSearched(true);
        } catch (e: any) {
            setError(e.response?.data?.message || 'Consumer not found or invalid ID');
        } finally { 
            setLoading(false); 
        }
    };

    // Derived Stats
    const totalBilled = bills.reduce((s, b) => s + b.totalAmount, 0);
    const totalPaid = payments.reduce((s, p) => s + p.amountPaid, 0);
    const outstanding = totalBilled - totalPaid;
    const avgConsumption = bills.length > 0 
        ? (bills.reduce((s, b) => s + b.unitsConsumed, 0) / bills.length).toFixed(1) 
        : 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Search Bar */}
            <div className="flex gap-3 bg-zinc-900/40 p-2 rounded-2xl border border-zinc-800/50">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text" 
                        value={consumerId} 
                        onChange={e => setConsumerId(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="Paste Consumer ID here..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-zinc-200 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                </div>
                <button 
                    onClick={handleSearch} 
                    disabled={loading}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/10"
                >
                    {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : 'Analyze'}
                </button>
            </div>

            <ErrorBanner message={error} onClear={() => setError(null)} />

            {searched && (
                <div className="space-y-6">
                    {/* Summary Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                            <div className="flex justify-between items-start mb-2">
                                <Receipt className="text-zinc-500" size={20} />
                                <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-bold uppercase tracking-widest">{bills.length} Bills</span>
                            </div>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Total Billed</p>
                            <p className="text-2xl font-black text-white">{formatCurrency(totalBilled)}</p>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                            <div className="flex justify-between items-start mb-2">
                                <CreditCard className="text-emerald-500" size={20} />
                                <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-500 font-bold uppercase tracking-widest">Collected</span>
                            </div>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Total Paid</p>
                            <p className="text-2xl font-black text-emerald-400">{formatCurrency(totalPaid)}</p>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                            <div className="flex justify-between items-start mb-2">
                                <History className={outstanding > 0 ? "text-rose-500" : "text-emerald-500"} size={20} />
                            </div>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Balance Due</p>
                            <p className={`text-2xl font-black ${outstanding > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {formatCurrency(outstanding)}
                            </p>
                        </div>

                        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-5">
                            <div className="flex justify-between items-start mb-2">
                                <TrendingUp className="text-indigo-400" size={20} />
                            </div>
                            <p className="text-xs text-indigo-400/70 font-bold uppercase tracking-widest">Avg Usage</p>
                            <p className="text-2xl font-black text-indigo-100">{avgConsumption} <span className="text-sm font-normal text-indigo-400">units</span></p>
                        </div>
                    </div>

                    {/* Data Tables */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Bills List */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between">
                                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Bill Issuance History</h3>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto divide-y divide-zinc-800/50 custom-scrollbar">
                                {bills.length === 0 ? (
                                    <div className="py-20 text-center text-zinc-600 italic">No billing records</div>
                                ) : (
                                    bills.map(b => (
                                        <div key={b._id} className="px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                                            <div>
                                                <p className="text-sm text-zinc-100 font-bold">{b.billMonth} {b.billYear}</p>
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-tight">Due: {formatDate(b.dueDate)}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <StatusBadge status={b.status} />
                                                <span className="text-sm font-black text-zinc-100 w-24 text-right">{formatCurrency(b.totalAmount)}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Payments List */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between">
                                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Payment Ledger</h3>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto divide-y divide-zinc-800/50 custom-scrollbar">
                                {payments.length === 0 ? (
                                    <div className="py-20 text-center text-zinc-600 italic">No payments recorded</div>
                                ) : (
                                    payments.map(p => {
                                        const bill = p.billId as any;
                                        return (
                                            <div key={p._id} className="px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                                                <div className="max-w-[180px]">
                                                    <p className="text-sm text-zinc-100 font-bold">{bill?.billMonth || 'Balance'} {bill?.billYear || 'Payment'}</p>
                                                    <p className="text-[10px] text-zinc-500 font-mono truncate">{p.transactionId}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <MethodBadge method={p.paymentMethod} />
                                                    <span className="text-sm font-black text-emerald-400 w-24 text-right">+{formatCurrency(p.amountPaid)}</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!searched && !loading && (
                <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                    <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center mb-4 ring-8 ring-zinc-900/50">
                        <History size={32} className="text-zinc-700" />
                    </div>
                    <h3 className="text-zinc-300 font-bold">Financial Audit Trail</h3>
                    <p className="text-sm text-zinc-600 max-w-xs mt-1">Enter a consumer ID above to reconcile bills, payments, and outstanding balances.</p>
                </div>
            )}
        </div>
    );
};