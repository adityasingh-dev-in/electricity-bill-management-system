import { useState, useEffect } from 'react';
import { MeterReadingForm } from '../../components/admin/billing/MeterReadingForm';
import { BillTable } from '../../components/admin/billing/BillTable';
import { BillFilters } from '../../components/admin/billing/BillFilters';
import { BillDetailsModal } from '../../components/admin/billing/BillDetailsModal';
import { MyBills } from '../../components/admin/billing/MyBills';
import { ReadingHistory } from '../../components/admin/billing/ReadingHistory';
import billService from '../../services/bill.service';
import type { Bill } from '../../services/bill.service';
import useUser from '../../hooks/useUser';

const Billing = () => {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'my-bills' | 'reading-history'>('generate');
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        month: '',
        year: '',
        status: ''
    });

    // Modal states
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchBills();
        }
    }, [activeTab, filters]);

    const fetchBills = async () => {
        setLoading(true);
        try {
            const response = await billService.getAllBills({
                ...filters,
                year: filters.year ? Number(filters.year) : undefined
            });
            setBills(response.data.bills);
        } catch (error) {
            console.error('Failed to fetch bills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleDownloadPDF = async (bill: Bill) => {
        try {
            const blob = await billService.getBillPDF(bill._id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bill_${bill._id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download PDF:', error);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await billService.updateBillStatus(id, status);
            fetchBills();
        } catch (error) {
            console.error('Failed to update bill status:', error);
        }
    };

    const handleDeleteBill = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this bill? This will also delete the associated meter reading.')) {
            try {
                await billService.deleteBill(id);
                fetchBills();
            } catch (error) {
                console.error('Failed to delete bill:', error);
            }
        }
    };

    const handleViewDetails = (bill: Bill) => {
        setSelectedBill(bill);
        setIsDetailsOpen(true);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 py-8 border-b border-zinc-800">
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-black text-zinc-100 tracking-tight">Billing Management</h1>
                    <p className="text-zinc-500 text-base sm:text-lg">Generate invoices and manage consumer utility payments.</p>
                </div>

                <div className="w-full lg:w-auto">
                    <div className="grid grid-cols-2 lg:flex bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800 backdrop-blur-md gap-1.5">
                        <button
                            onClick={() => setActiveTab('generate')}
                            className={`px-4 lg:px-6 py-3 lg:py-2.5 rounded-xl lg:rounded-lg text-[11px] lg:text-sm font-bold transition-all text-center ${activeTab === 'generate'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
                                }`}
                        >
                            Generate Bill
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-4 lg:px-6 py-3 lg:py-2.5 rounded-xl lg:rounded-lg text-[11px] lg:text-sm font-bold transition-all text-center ${activeTab === 'history'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
                                }`}
                        >
                            Bill History
                        </button>
                        <button
                            onClick={() => setActiveTab('my-bills')}
                            className={`px-4 lg:px-6 py-3 lg:py-2.5 rounded-xl lg:rounded-lg text-[11px] lg:text-sm font-bold transition-all text-center ${activeTab === 'my-bills'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
                                }`}
                        >
                            My Bills
                        </button>
                        <button
                            onClick={() => setActiveTab('reading-history')}
                            className={`px-4 lg:px-6 py-3 lg:py-2.5 rounded-xl lg:rounded-lg text-[11px] lg:text-sm font-bold transition-all text-center ${activeTab === 'reading-history'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
                                }`}
                        >
                            Analytics
                        </button>
                    </div>
                </div>
            </div>

            <main className="py-2">
                {activeTab === 'generate' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <MeterReadingForm
                                    onSuccess={() => {
                                        alert('Bill generated successfully!');
                                        setActiveTab('history');
                                    }}
                                />
                            </div>
                            <div className="space-y-6">
                                <div className="bg-linear-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl shadow-xl shadow-indigo-500/10 text-white overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                        <svg className="w-32 h-32" fill="white" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-black mb-2 relative z-10">Quick Tip</h3>
                                    <p className="text-indigo-100 relative z-10 font-medium leading-relaxed">
                                        Recording precise meter readings ensures accurate billing and helps consumers track their energy usage patterns efficiently.
                                    </p>
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4">
                                    <h4 className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Standard Rates</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-zinc-500">Fixed Charge:</span>
                                            <span className="text-zinc-200 font-bold">₹500.00</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-zinc-500">Energy Rate:</span>
                                            <span className="text-emerald-400 font-bold">₹8.50 / kWh</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                        <div className="bg-zinc-950/50 p-1 rounded-2xl border border-zinc-800/50">
                            <BillFilters filters={filters} onFilterChange={handleFilterChange} />
                            <BillTable
                                bills={bills}
                                loading={loading}
                                onViewDetails={handleViewDetails}
                                onDownloadPDF={handleDownloadPDF}
                                onUpdateStatus={handleUpdateStatus}
                                onDelete={handleDeleteBill}
                                isAdmin={user?.role === 'admin'}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'my-bills' && (
                    <MyBills
                        onViewDetails={handleViewDetails}
                        onDownloadPDF={handleDownloadPDF}
                        onUpdateStatus={handleUpdateStatus}
                        onDelete={handleDeleteBill}
                    />
                )}

                {activeTab === 'reading-history' && (
                    <ReadingHistory
                        onViewDetails={handleViewDetails}
                        onDownloadPDF={handleDownloadPDF}
                        onUpdateStatus={handleUpdateStatus}
                        onDelete={handleDeleteBill}
                    />
                )}
            </main>

            <BillDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                bill={selectedBill}
                onDownloadPDF={handleDownloadPDF}
            />
        </div>
    );
};

export default Billing;
