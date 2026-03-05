import React from 'react';
import {
    TrendingUp,
    Users,
    FileText,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { formatCurrency } from '../../../components/shared/ui';
import type { MonthlySummary } from '../../../services/dashboard.service';

interface SummaryCardsProps {
    summary: MonthlySummary | null;
    loading: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, loading }) => {
    const cards = [
        {
            label: 'Total Billed',
            value: summary ? formatCurrency(summary.totalBilled) : '₹0.00',
            sub: `${summary?.billCount || 0} Bills Generated`,
            icon: FileText,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20'
        },
        {
            label: 'Total Collected',
            value: summary ? formatCurrency(summary.totalCollected) : '₹0.00',
            sub: 'Current Month',
            icon: CheckCircle2,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        {
            label: 'Outstanding',
            value: summary ? formatCurrency(summary.totalBilled - summary.totalCollected) : '₹0.00',
            sub: `${summary?.pendingBills || 0} Pending / ${summary?.overdueBills || 0} Overdue`,
            icon: Clock,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20'
        },
        {
            label: 'Total Consumers',
            value: summary?.totalConsumers?.toString() || '0',
            sub: 'Active Connections',
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse">
                        <div className="h-4 w-24 bg-zinc-800 rounded mb-4"></div>
                        <div className="h-8 w-32 bg-zinc-800 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className="group p-6 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-2xl transition-all duration-300"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-2.5 rounded-xl ${card.bg} border ${card.border} ${card.color}`}>
                            <card.icon size={20} />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <TrendingUp size={10} />
                            +12%
                        </div>
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xs font-medium mb-1">{card.label}</p>
                        <h3 className="text-xl font-bold text-white mb-1">{card.value}</h3>
                        <p className="text-zinc-600 text-[10px] font-medium">{card.sub}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
