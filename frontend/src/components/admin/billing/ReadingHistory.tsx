import { useState } from 'react';
import meterReadingService from '../../../services/meterReading.service';
import type { Bill } from '../../../services/bill.service';
import type { Consumer } from '../../../services/consumer.service';
import { BillTable } from './BillTable';
import billService from '../../../services/bill.service';

interface ReadingHistoryProps {
    onViewDetails: (bill: Bill) => void;
    onDownloadPDF: (bill: Bill) => void;
    onUpdateStatus: (id: string, status: string) => void;
    onDelete: (id: string) => void;
}

export const ReadingHistory = ({
    onViewDetails,
    onDownloadPDF,
    onUpdateStatus,
    onDelete
}: ReadingHistoryProps) => {
    const [meterNumber, setMeterNumber] = useState('');
    const [consumer, setConsumer] = useState<Consumer | null>(null);
    const [bills, setBills] = useState<Bill[]>([]);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!meterNumber.trim()) return;

        setSearching(true);
        setError(null);
        setConsumer(null);
        setBills([]);

        try {
            // 1. Get Consumer details
            const consumerRes = await meterReadingService.getConsumerDetailsByMeter(meterNumber);
            const foundConsumer = consumerRes.data.consumer;
            setConsumer(foundConsumer);

            // 2. Get Bill History for this consumer
            if (foundConsumer?._id) {
                const billsRes = await billService.getConsumerBillHistory(foundConsumer._id);
                setBills(billsRes.data);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Consumer not found');
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            {/* Search Header */}
            <div className="bg-zinc-900/50 p-4 sm:p-8 rounded-2xl border border-zinc-800">
                <form onSubmit={handleSearch} className="max-w-xl">
                    <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Search Consumer History</label>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={meterNumber}
                                onChange={(e) => setMeterNumber(e.target.value)}
                                placeholder="Meter Number (e.g., MTR1234)"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 text-zinc-100 text-sm sm:font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-700"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={searching}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 sm:py-0 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            {searching ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/50"></div>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                            <span>Search Now</span>
                        </button>
                    </div>
                    {error && <p className="mt-3 text-rose-400 text-sm font-medium">{error}</p>}
                </form>
            </div>

            {/* Content Results */}
            {consumer && (
                <div className="space-y-6">
                    {/* Consumer Quick View */}
                    <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-4 sm:gap-5">
                            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-zinc-100">{consumer.name}</h3>
                                <div className="flex flex-wrap gap-2 sm:gap-4 text-zinc-500 text-xs sm:text-sm mt-1">
                                    <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">{consumer.meterNumber}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>{consumer.area}, {consumer.city}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-auto bg-zinc-800/50 px-6 py-4 rounded-xl border border-zinc-800/50 flex sm:block justify-between items-center">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase sm:mb-1">Total Bills</p>
                            <p className="text-xl font-bold text-zinc-200">{bills.length}</p>
                        </div>
                    </div>

                    {/* Bills History Table */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-800 bg-zinc-800/20">
                            <h4 className="text-[10px] sm:text-sm font-bold text-zinc-400 uppercase tracking-widest">Historical Bills & Readings</h4>
                        </div>
                        <BillTable
                            bills={bills}
                            loading={searching}
                            onViewDetails={onViewDetails}
                            onDownloadPDF={onDownloadPDF}
                            onUpdateStatus={onUpdateStatus}
                            onDelete={onDelete}
                        />
                    </div>
                </div>
            )}

            {!consumer && !searching && !error && (
                <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                    <svg className="w-20 h-20 text-zinc-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="text-xl font-bold text-zinc-400">No Consumer Selected</h3>
                    <p className="text-zinc-600 max-w-sm mx-auto mt-2">Enter a meter number above to view full history and past bills.</p>
                </div>
            )}
        </div>
    );
};
