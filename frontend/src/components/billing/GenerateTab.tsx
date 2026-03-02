import { useState, useCallback } from 'react';
import meterReadingService from '../../services/meterReading.service';
import type { Consumer } from '../../services/consumer.service';
import { ErrorBanner } from '../shared/ui';

export const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

interface Props {
    onBillGenerated: (result: { reading: any; bill: any }) => void;
}

export const GenerateTab: React.FC<Props> = ({ onBillGenerated }) => {
    const [meterNumber, setMeterNumber] = useState('');
    const [currentReading, setCurrentReading] = useState('');
    const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [consumer, setConsumer] = useState<Consumer | null>(null);
    const [lastReading, setLastReading] = useState<any>(null);
    const [fetching, setFetching] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const years = Array.from({ length: 3 }, (_, i) => (new Date().getFullYear() - i).toString());

    const handleMeterSearch = useCallback(async (val: string) => {
        setMeterNumber(val);
        if (val.length < 4) { setConsumer(null); setLastReading(null); setError(null); return; }
        setFetching(true); setError(null);
        try {
            const res = await meterReadingService.getConsumerDetailsByMeter(val);
            setConsumer(res.data.consumer);
            setLastReading(res.data.lastReading);
        } catch (e: any) {
            setConsumer(null); setLastReading(null);
            setError(e.response?.data?.message || 'Consumer not found');
        } finally { setFetching(false); }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!consumer) return;
        setSubmitting(true); setError(null);
        try {
            const res = await meterReadingService.createMeterReading({
                meterNumber, currentReading: Number(currentReading), month, year: Number(year),
            });
            onBillGenerated(res.data);
            setMeterNumber(''); setCurrentReading(''); setConsumer(null); setLastReading(null);
        } catch (e: any) {
            setError(e.response?.data?.message || 'Failed to generate bill');
        } finally { setSubmitting(false); }
    };

    const prevReading = lastReading?.currentReading ?? 0;
    const units = consumer && currentReading ? Math.max(0, Number(currentReading) - prevReading) : 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <ErrorBanner message={error} onClear={() => setError(null)} />

            {/* Step 1: Meter Search */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Step 1 — Meter Search</h3>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        type="text" value={meterNumber} onChange={e => handleMeterSearch(e.target.value)}
                        placeholder="Type meter number to search consumer..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-12 py-3.5 text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                        required
                    />
                    {fetching && <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500" />}
                </div>

                {consumer && (
                    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="h-12 w-12 shrink-0 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-lg">
                            {consumer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-base font-bold text-zinc-100">{consumer.name}</p>
                            <p className="text-sm text-zinc-500 truncate">{consumer.area}, {consumer.city} &mdash; Meter #{consumer.meterNumber}</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm shrink-0">
                            <div className="text-center px-3 py-2 bg-zinc-900/80 rounded-lg border border-zinc-800">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase mb-0.5">Prev. Reading</p>
                                <p className="text-zinc-200 font-bold">{prevReading} <span className="text-zinc-500 font-normal text-xs">kWh</span></p>
                            </div>
                            {currentReading && (
                                <div className="text-center px-3 py-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                    <p className="text-[10px] text-indigo-400 font-bold uppercase mb-0.5">Units Used</p>
                                    <p className="text-indigo-300 font-bold">{units} <span className="text-indigo-400/60 font-normal text-xs">kWh</span></p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Step 2: Reading Entry */}
            <div className={`bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5 transition-opacity duration-300 ${!consumer ? 'opacity-40 pointer-events-none' : ''}`}>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Step 2 — Enter Reading</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Month</label>
                        <select value={month} onChange={e => setMonth(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                            {MONTHS.map(m => <option key={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Year</label>
                        <select value={year} onChange={e => setYear(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                            {years.map(y => <option key={y}>{y}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Current Reading (kWh)</label>
                        <input
                            type="number" value={currentReading} onChange={e => setCurrentReading(e.target.value)}
                            placeholder="0" min={prevReading}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-zinc-700"
                            required
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit" disabled={!consumer || submitting}
                className={`w-full py-4 rounded-xl font-bold text-base shadow-xl transition-all flex items-center justify-center gap-3 ${!consumer || submitting ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 active:scale-[0.98]'}`}
            >
                {submitting
                    ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/50" /><span>Generating Bill...</span></>
                    : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg><span>Save &amp; Generate Bill</span></>
                }
            </button>
        </form>
    );
};

