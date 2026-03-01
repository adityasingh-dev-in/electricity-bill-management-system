
import type { Bill } from '../../../services/bill.service';
import type { Consumer } from '../../../services/consumer.service';

interface BillDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    bill: Bill | null;
    onDownloadPDF: (bill: Bill) => void;
}

export const BillDetailsModal: React.FC<BillDetailsModalProps> = ({
    isOpen,
    onClose,
    bill,
    onDownloadPDF
}) => {
    if (!isOpen || !bill) return null;

    const consumer = bill.consumerId as Consumer;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/20">
                    <h2 className="text-xl font-bold text-zinc-100">Bill Details</h2>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Consumer Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Consumer Details</h3>
                            <div className="bg-zinc-800/30 p-4 rounded-xl space-y-2 border border-zinc-800/50">
                                <p className="text-lg font-semibold text-zinc-100">{consumer?.name}</p>
                                <p className="text-sm text-zinc-400"><span className="text-zinc-500">Meter:</span> {consumer?.meterNumber}</p>
                                <p className="text-sm text-zinc-400"><span className="text-zinc-500">Address:</span> {consumer?.area}, {consumer?.city}</p>
                                <p className="text-sm text-zinc-400"><span className="text-zinc-500">Phone:</span> {consumer?.phone}</p>
                            </div>
                        </div>

                        {/* Bill Summary */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Bill Summary</h3>
                            <div className="bg-zinc-800/30 p-4 rounded-xl space-y-2 border border-zinc-800/50">
                                <div className="flex justify-between">
                                    <span className="text-sm text-zinc-500">Period:</span>
                                    <span className="text-sm font-medium text-zinc-200">{bill.billMonth} {bill.billYear}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-zinc-500">Due Date:</span>
                                    <span className="text-sm font-medium text-zinc-200">{new Date(bill.dueDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-zinc-500">Status:</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase border ${bill.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                        {bill.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reading Details */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Reading Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <div className="bg-zinc-800/30 p-3 rounded-xl border border-zinc-800/50">
                                <p className="text-xs text-zinc-500 mb-1">Previous</p>
                                <p className="text-lg font-bold text-zinc-200">{bill.unitsConsumed + (bill.unitsConsumed > 0 ? 0 : 0)} kW</p>
                            </div>
                            <div className="bg-zinc-800/30 p-3 rounded-xl border border-zinc-800/50">
                                <p className="text-xs text-zinc-500 mb-1">Current</p>
                                <p className="text-lg font-bold text-zinc-200">-- kW</p>
                            </div>
                            <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
                                <p className="text-xs text-indigo-400 mb-1">Consumed</p>
                                <p className="text-xl font-bold text-indigo-300">{bill.unitsConsumed} kW</p>
                            </div>
                        </div>
                    </div>

                    {/* Charges Table */}
                    <div className="space-y-3 mb-8">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Charge Breakdown</h3>
                        <div className="flex justify-between py-2 border-b border-zinc-800/50">
                            <span className="text-zinc-400 text-sm">Energy Charge</span>
                            <span className="text-zinc-100 font-medium">₹{bill.energyCharge.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-zinc-800/50">
                            <span className="text-zinc-400 text-sm">Fixed Charge</span>
                            <span className="text-zinc-100 font-medium">₹{bill.fixedCharge.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-4">
                            <span className="text-lg font-bold text-zinc-100">Total Amount</span>
                            <span className="text-2xl font-black text-indigo-400">₹{bill.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => onDownloadPDF(bill)}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            Download Invoice PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
