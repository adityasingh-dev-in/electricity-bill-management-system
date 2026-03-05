import React, { useState } from 'react';
import type { ComplaintQueryParams } from '../../services/complaint.service';
import { Filter, UserSearch } from 'lucide-react';

interface ComplaintFiltersProps {
    filters: ComplaintQueryParams;
    onFilterChange: (newFilters: ComplaintQueryParams | { meterNumber: string | null }) => void;
    onClearFilters: () => void;
}

const ComplaintFilters: React.FC<ComplaintFiltersProps> = ({ filters, onFilterChange, onClearFilters }) => {
    const [activeTab, setActiveTab] = useState<'all' | 'search'>((filters as any).meterNumber ? 'search' : 'all');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    const handleTabChange = (tab: 'all' | 'search') => {
        setActiveTab(tab);
        if (tab === 'all') {
            // If switching to all, clear meter search
            onFilterChange({ meterNumber: null } as any);
        } else {
            // If switching to search, clear other filters
            onClearFilters();
        }
    };

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mb-6">
            {/* Tabs Header */}
            <div className="flex border-b border-neutral-800">
                <button
                    onClick={() => handleTabChange('all')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'all'
                        ? 'bg-neutral-800 text-white border-b-2 border-blue-500'
                        : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'
                        }`}
                >
                    <Filter size={14} />
                    Global Filters
                </button>
                <button
                    onClick={() => handleTabChange('search')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-1 text-xs font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'search'
                        ? 'bg-neutral-800 text-white border-b-2 border-amber-500'
                        : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'
                        }`}
                >
                    <UserSearch size={14} />
                    Consumer Search
                </button>
            </div>

            <div className="p-6">
                {activeTab === 'all' ? (
                    <div className="animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-400">Status</label>
                                <select
                                    name="status"
                                    value={filters.status || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-400">Importance</label>
                                <select
                                    name="importance"
                                    value={filters.importance || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                                >
                                    <option value="">All Importance</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-400">Area</label>
                                <input
                                    type="text"
                                    name="area"
                                    placeholder="Filter by area..."
                                    value={filters.area || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-400">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Filter by city..."
                                    value={filters.city || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={onClearFilters}
                                className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
                            >
                                Clear All Global Filters
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-neutral-400">Search by Consumer Meter Number</label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    name="meterNumber"
                                    defaultValue={(filters as any).meterNumber || ''}
                                    placeholder="Enter Meter Number..."
                                    className="flex-1 px-4 py-3 sm:py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = (e.currentTarget as HTMLInputElement).value;
                                            onFilterChange({ meterNumber: val });
                                        }
                                    }}
                                />
                                <button
                                    onClick={(e) => {
                                        const input = (e.currentTarget.parentElement as HTMLElement).querySelector('input') as HTMLInputElement;
                                        onFilterChange({ meterNumber: input.value });
                                    }}
                                    className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black rounded-xl transition-all active:scale-95 text-xs uppercase tracking-wider"
                                >
                                    Search Consumer
                                </button>
                            </div>
                            <p className="text-[10px] text-neutral-500 mt-2 italic leading-relaxed">
                                * This search bypasses global filters to show all complaints for a specific consumer.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintFilters;
