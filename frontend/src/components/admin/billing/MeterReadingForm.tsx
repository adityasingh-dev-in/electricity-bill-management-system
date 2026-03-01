import { useState, useEffect } from 'react';
import meterReadingService from '../../../services/meterReading.service';
import type { Consumer } from '../../../services/consumer.service';

interface MeterReadingFormProps {
    onSuccess: (data: any) => void;
}

export const MeterReadingForm: React.FC<MeterReadingFormProps> = ({ onSuccess }) => {
    const [meterNumber, setMeterNumber] = useState('');
    const [currentReading, setCurrentReading] = useState('');
    const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [year, setYear] = useState(new Date().getFullYear().toString());

    const [consumer, setConsumer] = useState<Consumer | null>(null);
    const [lastReading, setLastReading] = useState<any>(null);
    const [fetching, setFetching] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentYearNum = new Date().getFullYear();
    const years = Array.from({ length: 3 }, (_, i) => (currentYearNum - i).toString());

    // Fetch consumer details when meter number is entered (debounced)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (meterNumber.length >= 4) {
                setFetching(true);
                setError(null);
                try {
                    const response = await meterReadingService.getConsumerDetailsByMeter(meterNumber);
                    setConsumer(response.data.consumer);
                    setLastReading(response.data.lastReading);
                } catch (err: any) {
                    setConsumer(null);
                    setLastReading(null);
                    setError(err.response?.data?.message || 'Consumer not found');
                } finally {
                    setFetching(false);
                }
            } else {
                setConsumer(null);
                setLastReading(null);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [meterNumber]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!consumer) return;

        setSubmitting(true);
        setError(null);
        try {
            const response = await meterReadingService.createMeterReading({
                meterNumber,
                currentReading: Number(currentReading),
                month,
                year: Number(year)
            });
            onSuccess(response.data);
            // Reset form
            setMeterNumber('');
            setCurrentReading('');
            setConsumer(null);
            setLastReading(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to record reading');
        } finally {
            setSubmitting(false);
        }
    };

    const unitsConsumed = consumer && currentReading
        ? Math.max(0, Number(currentReading) - (lastReading?.currentReading || 0))
        : 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 bg-zinc-900/50 p-4 sm:p-8 rounded-2xl border border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Meter Number</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={meterNumber}
                                onChange={(e) => setMeterNumber(e.target.value)}
                                placeholder="Enter meter number..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-zinc-100 text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-700"
                                required
                            />
                            {fetching && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Month</label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Year</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Current Reading (kWh)</label>
                        <input
                            type="number"
                            value={currentReading}
                            onChange={(e) => setCurrentReading(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-zinc-100 text-xl sm:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-800"
                            required
                        />
                    </div>
                </div>

                <div className="bg-zinc-800/20 rounded-2xl border border-zinc-800/50 p-4 sm:p-6 flex flex-col min-h-[160px]">
                    <h3 className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 sm:mb-6">Consumer Verification</h3>

                    {consumer ? (
                        <div className="flex-1 space-y-4 sm:space-y-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-lg sm:text-xl font-bold text-zinc-100">{consumer.name}</p>
                                    <p className="text-xs sm:text-sm text-zinc-500">{consumer.area}, {consumer.city}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="bg-zinc-900/50 p-3 sm:p-4 rounded-xl border border-zinc-800/50">
                                    <p className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase mb-1">Last Reading</p>
                                    <p className="text-base sm:text-lg font-bold text-zinc-300">{lastReading?.currentReading || 0} kW</p>
                                </div>
                                <div className="bg-indigo-500/5 p-3 sm:p-4 rounded-xl border border-indigo-500/10">
                                    <p className="text-[9px] sm:text-[10px] font-bold text-indigo-400 uppercase mb-1">Consumed</p>
                                    <p className="text-base sm:text-lg font-bold text-indigo-300">{unitsConsumed} kW</p>
                                </div>
                            </div>

                            <div className="pt-3 sm:pt-4 border-t border-zinc-800/50 hidden sm:block">
                                <p className="text-xs text-zinc-500 italic">Verify consumer details before generating the bill.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 sm:space-y-3">
                            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-600">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <p className="text-zinc-500 text-[11px] sm:text-sm max-w-[180px] sm:max-w-[200px]">Enter a valid meter number to see consumer information</p>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
                    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!consumer || submitting}
                className={`w-full py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${!consumer || submitting
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 active:scale-[0.98]'
                    }`}
            >
                {submitting ? (
                    <div className="animate-spin rounded-full h-5 sm:h-6 w-5 sm:w-6 border-b-2 border-white/50"></div>
                ) : (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                )}
                {submitting ? 'Generating...' : 'Generate Bill Now'}
            </button>
        </form>
    );
};
