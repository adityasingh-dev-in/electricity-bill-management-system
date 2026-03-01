

interface BillFiltersProps {
    filters: {
        month: string;
        year: string;
        status: string;
    };
    onFilterChange: (name: string, value: string) => void;
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

export const BillFilters: React.FC<BillFiltersProps> = ({ filters, onFilterChange }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Month</label>
                <select
                    value={filters.month}
                    onChange={(e) => onFilterChange('month', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                    <option value="">All Months</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Year</label>
                <select
                    value={filters.year}
                    onChange={(e) => onFilterChange('year', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                    <option value="">All Years</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Status</label>
                <select
                    value={filters.status}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                </select>
            </div>
        </div>
    );
};
