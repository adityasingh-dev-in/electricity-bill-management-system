import { useState, useCallback, useEffect } from 'react';
import { X, RefreshCw, Download, Trash2} from 'lucide-react';
import billService from '../../services/bill.service';
import type { Bill } from '../../services/bill.service';
import { SkeletonRow, StatusBadge, formatCurrency, Pagination } from '../shared/ui';
import toast from 'react-hot-toast';

const PAGE_LIMIT = 5;

export const ViewBill: React.FC<any> = ({ consumerId, consumerName, isOpen, onClose, isAdmin }) => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchConsumerBills = useCallback(async (targetPage = page) => {
        if (!consumerId) return;
        setLoading(true);
        try {
            const res = await billService.getConsumerBillHistory(consumerId, { 
                page: targetPage, 
                limit: PAGE_LIMIT 
            });
            // Matching the new paginated controller structure
            setBills(res.data.bills);
            setTotalPages(res.data.pagination.totalPages);
            setTotalItems(res.data.pagination.totalItems);
            setPage(res.data.pagination.currentPage);
        } catch (e: any) {
            toast.error("Failed to load history");
        } finally {
            setLoading(false);
        }
    }, [consumerId, page]);

    useEffect(() => {
        if (isOpen) fetchConsumerBills(1); // Reset to page 1 when opening
    }, [isOpen, consumerId]); // Removed fetchConsumerBills from deps to prevent loops

    const handlePageChange = (newPage: number) => {
        fetchConsumerBills(newPage);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight">Billing History</h2>
                        <p className="text-sm text-indigo-400 font-bold">{consumerName} • {totalItems} Total Bills</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => fetchConsumerBills()} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400">
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl text-zinc-400">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-900/50 border-b border-zinc-800">
                                <tr>
                                    <th className="px-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Period</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Units</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Amount</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {loading ? (
                                    Array.from({ length: PAGE_LIMIT }).map((_, i) => <SkeletonRow key={i} cols={5} />)
                                ) : bills.length === 0 ? (
                                    <tr><td colSpan={5} className="py-12 text-center text-zinc-500">No records.</td></tr>
                                ) : (
                                    bills.map((bill) => (
                                        <tr key={bill._id} className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-4 py-4">
                                                <p className="text-sm font-bold text-zinc-200">{bill.billMonth} {bill.billYear}</p>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="font-mono text-xs text-zinc-400">{bill.unitsConsumed}</span>
                                            </td>
                                            <td className="px-4 py-4 font-black text-white">
                                                {formatCurrency(bill.totalAmount)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <StatusBadge status={bill.status} />
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-1.5 hover:text-indigo-400"><Download size={14}/></button>
                                                    {isAdmin && <button className="p-1.5 hover:text-rose-400"><Trash2 size={14}/></button>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer with Pagination */}
                <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
                    <Pagination 
                        page={page} 
                        totalPages={totalPages} 
                        onChange={handlePageChange} 
                    />
                </div>
            </div>
        </div>
    );
};