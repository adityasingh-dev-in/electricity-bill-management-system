// ─── Shared UI helpers ───────────────────────────────────────────────────────

export const formatCurrency = (n: number) =>
    `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

export const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatDateTime = (d: string) =>
    new Date(d).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });

// ─── Status Badge (bills) ────────────────────────────────────────────────────

const BILL_STATUS_CONFIG: Record<string, { label: string; text: string; bg: string; border: string; dot: string }> = {
    pending: { label: 'Pending', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
    paid: { label: 'Paid', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
    overdue: { label: 'Overdue', text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', dot: 'bg-rose-400' },
};

export const StatusBadge = ({ status }: { status: 'pending' | 'paid' | 'overdue' }) => {
    const cfg = BILL_STATUS_CONFIG[status] ?? BILL_STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

// ─── Error Banner ─────────────────────────────────────────────────────────────

export const ErrorBanner = ({ message, onClear }: { message: string | null; onClear?: () => void }) => {
    if (!message) return null;
    return (
        <div className="flex items-center justify-between gap-3 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {message}
            </div>
            {onClear && (
                <button onClick={onClear} className="text-rose-400/60 hover:text-rose-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            )}
        </div>
    );
};

// ─── Payment Method Badge ─────────────────────────────────────────────────────

const METHOD_CONFIG: Record<string, string> = {
    cash: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    card: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    online: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    other: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
};

export const MethodBadge = ({ method }: { method: string }) => {
    const cls = METHOD_CONFIG[method] ?? METHOD_CONFIG.other;
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${cls}`}>
            {method}
        </span>
    );
};

// ─── Skeleton row ─────────────────────────────────────────────────────────────

export const SkeletonRow = ({ cols }: { cols: number }) => (
    <tr className="border-t border-zinc-800/50">
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i} className="px-4 py-3.5">
                <div className="h-4 bg-zinc-800/80 rounded animate-pulse" />
            </td>
        ))}
    </tr>
);

// ─── Tab switcher ─────────────────────────────────────────────────────────────

interface Tab<T extends string> {
    key: T;
    label: string;
}

interface TabBarProps<T extends string> {
    tabs: Tab<T>[];
    active: T;
    onChange: (t: T) => void;
    accent?: 'indigo' | 'emerald';
}

export function TabBar<T extends string>({ tabs, active, onChange, accent = 'indigo' }: TabBarProps<T>) {
    const activeClass = accent === 'emerald'
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
        : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20';
    return (
        <div className="flex bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800 gap-1.5">
            {tabs.map(({ key, label }) => (
                <button
                    key={key}
                    onClick={() => onChange(key)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${active === key ? activeClass : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'}`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

// ─── Pagination ─────────────────────────────────────────────────────────────

export const Pagination = ({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between">
            <p className="text-xs text-zinc-600">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => onChange(page - 1)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-400 font-bold transition-all">
                    Previous
                </button>
                <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-400 font-bold transition-all">
                    Next
                </button>
            </div>
        </div>
    );
};
