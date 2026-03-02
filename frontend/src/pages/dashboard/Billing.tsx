import { useState } from 'react';
import useUser from '../../hooks/useUser';
import type { Bill } from '../../services/bill.service';
import { TabBar } from '../../components/shared/ui';
import { GenerateTab } from '../../components/billing/GenerateTab';
import { BillSuccessCard } from '../../components/billing/BillSuccessCard';
import { AuditTrail } from '../../components/billing/AuditTrail';

interface GenerateResult { reading: any; bill: Bill; }

const TABS = [
    { key: 'generate' as const, label: 'Generate Bill' },
    { key: 'audit' as const, label: 'Audit Trail' },
];

const Billing = () => {
    const { user } = useUser();
    const isAdmin = user?.role === 'admin';
    const [activeTab, setActiveTab] = useState<'generate' | 'audit'>('generate');
    const [successResult, setSuccessResult] = useState<GenerateResult | null>(null);

    const handleTabChange = (tab: 'generate' | 'audit') => {
        setActiveTab(tab);
        if (tab === 'generate') setSuccessResult(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 py-8 border-b border-zinc-800 mb-6">
                <div className="space-y-1.5">
                    <h1 className="text-3xl sm:text-4xl font-black text-zinc-100 tracking-tight">Billing Hub</h1>
                    <p className="text-zinc-500">Generate invoices and audit all consumer billing records.</p>
                </div>
                <TabBar tabs={TABS} active={activeTab} onChange={handleTabChange} accent="indigo" />
            </div>

            <main className="pb-12">
                {activeTab === 'generate' && (
                    <div className="max-w-3xl mx-auto">
                        {successResult
                            ? <BillSuccessCard
                                result={successResult}
                                onNew={() => setSuccessResult(null)}
                                onViewBills={() => { setActiveTab('audit'); setSuccessResult(null); }}
                            />
                            : <GenerateTab onBillGenerated={setSuccessResult} />
                        }
                    </div>
                )}
                {activeTab === 'audit' && <AuditTrail isAdmin={isAdmin} />}
            </main>
        </div>
    );
};

export default Billing;
