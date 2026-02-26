import { Search, Plus, RotateCcw, SlidersHorizontal } from "lucide-react";

interface ConsumerFiltersProps {
    onSearch: (filters: any) => void;
    onAddClick: () => void;
    filters: {
        name: string;
        meterNumber: string;
        phone: string;
        city: string;
        sortBy: string;
    };
}

const ConsumerFilters = ({ onSearch, onAddClick, filters }: ConsumerFiltersProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onSearch({ ...filters, [name]: value });
    };

    const handleReset = () => {
        onSearch({
            name: "",
            meterNumber: "",
            phone: "",
            city: "",
            sortBy: "createdAt"
        });
    };

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 mb-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleChange}
                        placeholder="Search consumers by name..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-[2]">
                    <div className="space-y-1">
                        <input
                            type="text"
                            name="meterNumber"
                            value={filters.meterNumber}
                            onChange={handleChange}
                            placeholder="Meter No."
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <input
                            type="text"
                            name="phone"
                            value={filters.phone}
                            onChange={handleChange}
                            placeholder="Phone Link"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <input
                            type="text"
                            name="city"
                            value={filters.city}
                            onChange={handleChange}
                            placeholder="City / Region"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <select
                            name="sortBy"
                            value={filters.sortBy}
                            onChange={handleChange}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                        >
                            <option value="createdAt">Newest First</option>
                            <option value="name">Name A-Z</option>
                            <option value="city">By City</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        title="Reset Filters"
                        className="flex h-11 w-11 items-center justify-center border border-neutral-800 rounded-2xl hover:bg-neutral-800 text-neutral-500 hover:text-white transition-all active:scale-95"
                    >
                        <RotateCcw size={18} />
                    </button>
                    <button
                        onClick={onAddClick}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 px-8 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={20} />
                        Add New
                    </button>
                    <button className="h-11 w-11 flex items-center justify-center border border-neutral-800 rounded-2xl hover:bg-neutral-800 transition-colors text-neutral-400 lg:hidden">
                        <SlidersHorizontal size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConsumerFilters;
