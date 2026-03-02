import billService from '../../services/bill.service';
import type { Bill } from '../../services/bill.service';
import { formatCurrency, formatDate } from '../shared/ui';

interface Props {
    result: { reading: any; bill: Bill };
    onNew: () => void;
    onViewBills: () => void;
}

export const BillSuccessCard: React.FC<Props> = ({ result, onNew, onViewBills }) => {
    const handleDownloadPDF = async () => {
        const blob = await billService.getBillPDF(result.bill._id);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', `Bill_${result.bill._id}.pdf`);
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    return (
        <div className="text-center space-y-6 py-4">
            <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-black text-zinc-100 mb-1">Bill Generated!</h3>
                <p className="text-zinc-500">The bill has been created and is ready for collection.</p>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-left space-y-3 max-w-sm mx-auto">
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Period</span>
                    <span className="text-zinc-200 font-medium">{result.bill.billMonth} {result.bill.billYear}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Units Consumed</span>
                    <span className="text-zinc-200 font-medium">{result.bill.unitsConsumed} kWh</span>
                </div>
                <div className="border-t border-zinc-800 pt-3 flex justify-between">
                    <span className="text-zinc-400 font-bold">Total Amount</span>
                    <span className="text-emerald-400 font-black text-lg">{formatCurrency(result.bill.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Due Date</span>
                    <span className="text-amber-400 font-medium">{formatDate(result.bill.dueDate)}</span>
                </div>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
                <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Download PDF
                </button>
                <button onClick={onViewBills} className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-bold text-sm transition-all">View All Bills</button>
                <button onClick={onNew} className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-xl font-bold text-sm transition-all">New Entry</button>
            </div>
        </div>
    );
};
