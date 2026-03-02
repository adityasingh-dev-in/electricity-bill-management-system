import { useState } from 'react';
import { TabBar } from '../../components/shared/ui';
import { RecordPaymentTab } from '../../components/payments/RecordPaymentTab';
import { ConsumerHistoryTab } from '../../components/payments/ConsumerHistoryTab';
import { RevenueFeedTab } from '../../components/payments/RevenueFeedTab';

const TABS = [
    { key: 'record' as const, label: 'Record Payment' },
    { key: 'history' as const, label: 'Consumer History' },
    { key: 'feed' as const, label: 'Revenue Feed' },
];

const Payments = () => {
    const [activeTab, setActiveTab] = useState<'record' | 'history' | 'feed'>('record');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 py-8 border-b border-zinc-800 mb-6">
                <div className="space-y-1.5">
                    <h1 className="text-3xl sm:text-4xl font-black text-zinc-100 tracking-tight">Collections Desk</h1>
                    <p className="text-zinc-500">Record payments, resolve overdue bills, and monitor revenue.</p>
                </div>
                <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} accent="emerald" />
            </div>

            <main className="pb-12">
                {activeTab === 'record' && <RecordPaymentTab />}
                {activeTab === 'history' && <ConsumerHistoryTab />}
                {activeTab === 'feed' && <RevenueFeedTab />}
            </main>
        </div>
    );
};

export default Payments;
