
import type { Bill } from '../../../services/bill.service';
import type { Consumer } from '../../../services/consumer.service';

interface BillTableProps {
    bills: Bill[];
    loading: boolean;
    onViewDetails: (bill: Bill) => void;
    onDownloadPDF: (bill: Bill) => void;
    onUpdateStatus: (id: string, status: string) => void;
    onDelete: (id: string) => void;
}

export const BillTable: React.FC<BillTableProps> = ({
    bills,
    loading,
    onViewDetails,
    onDownloadPDF,
    onUpdateStatus,
    onDelete
}) => {
    if (loading && bills.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!loading && bills.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <p>No bills found.</p>
            </div>
        );
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'overdue':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default:
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        }
    };

    return (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left text-zinc-400">
                    <thead className="text-xs text-zinc-300 uppercase bg-zinc-800/50 border-b border-zinc-800">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Consumer / Meter</th>
                            <th className="px-6 py-4 font-semibold">Period</th>
                            <th className="px-6 py-4 font-semibold">Amount</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Due Date</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                        {bills.map((bill) => {
                            const consumer = bill.consumerId as Consumer;
                            return (
                                <tr key={bill._id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-zinc-100">{consumer?.name || 'N/A'}</div>
                                        <div className="text-xs text-zinc-500">{consumer?.meterNumber || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {bill.billMonth} {bill.billYear}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-zinc-100">
                                        ₹{bill.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusStyle(bill.status)}`}>
                                            {bill.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500">
                                        {new Date(bill.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => onViewDetails(bill)}
                                            className="p-1.5 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDownloadPDF(bill)}
                                            className="p-1.5 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                            title="Download PDF"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                            </svg>
                                        </button>
                                        {bill.status !== 'paid' && (
                                            <button
                                                onClick={() => onUpdateStatus(bill._id, 'paid')}
                                                className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                                                title="Mark as Paid"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                        )}
                                        {bill.status === 'pending' && (
                                            <button
                                                onClick={() => onDelete(bill._id)}
                                                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                                title="Delete Bill"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-zinc-800/80">
                {bills.map((bill) => {
                    const consumer = bill.consumerId as Consumer;
                    return (
                        <div key={bill._id} className="p-4 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-zinc-100">{consumer?.name || 'N/A'}</div>
                                    <div className="text-xs text-zinc-500">{consumer?.meterNumber || 'N/A'}</div>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusStyle(bill.status)}`}>
                                    {bill.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-tight">Period</p>
                                    <p className="text-zinc-300">{bill.billMonth} {bill.billYear}</p>
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-tight">Amount</p>
                                    <p className="text-indigo-400 font-black">₹{bill.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => onViewDetails(bill)}
                                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded-lg text-xs font-bold transition-colors"
                                >
                                    Details
                                </button>
                                <button
                                    onClick={() => onDownloadPDF(bill)}
                                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded-lg text-xs font-bold transition-colors"
                                >
                                    PDF
                                </button>
                                {bill.status !== 'paid' && (
                                    <button
                                        onClick={() => onUpdateStatus(bill._id, 'paid')}
                                        className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 py-2 rounded-lg text-xs font-bold transition-colors border border-emerald-600/20"
                                    >
                                        Pay
                                    </button>
                                )}
                                {bill.status === 'pending' && (
                                    <button
                                        onClick={() => onDelete(bill._id)}
                                        className="p-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 rounded-lg transition-colors border border-rose-600/10"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
