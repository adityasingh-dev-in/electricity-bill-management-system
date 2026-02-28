import { useState, useEffect, useCallback } from 'react';
import { Plus, Zap, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import tariffService, { type TariffData } from '../../services/tariff.service';
import ActiveTariffCard from '../../components/admin/ActiveTariffCard';
import TariffHistoryTable from '../../components/admin/TariffHistoryTable';
import TariffModal from '../../components/admin/TariffModal';

const Tariffs = () => {
    // State
    const [activeTariff, setActiveTariff] = useState<TariffData | null>(null);
    const [history, setHistory] = useState<TariffData[]>([]);
    const [totalHistory, setTotalHistory] = useState(0);
    const [loadingActive, setLoadingActive] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [page, setPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTariff, setSelectedTariff] = useState<TariffData | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    const limit = 5;

    // Fetch Active Tariff
    const fetchActiveTariff = useCallback(async () => {
        try {
            setLoadingActive(true);
            const data = await tariffService.getActiveTariff();
            setActiveTariff(data);
        } catch (error: any) {
            console.error("Error fetching active tariff:", error);
            // Don't toast error here if it's 404 (handled by component)
            if (error?.response?.status !== 404) {
                toast.error("Failed to load active tariff");
            }
        } finally {
            setLoadingActive(false);
        }
    }, []);

    // Fetch History
    const fetchHistory = useCallback(async (pageNum: number) => {
        try {
            setLoadingHistory(true);
            const data = await tariffService.getTariffHistory(pageNum, limit);
            setHistory(data.tariff);
            setTotalHistory(data.totalTariff);
        } catch (error) {
            console.error("Error fetching tariff history:", error);
            toast.error("Failed to load tariff history");
        } finally {
            setLoadingHistory(false);
        }
    }, [limit]);

    // Initial Load
    useEffect(() => {
        fetchActiveTariff();
        fetchHistory(page);
    }, [fetchActiveTariff, fetchHistory, page]);

    // Refresh Handler
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await Promise.all([fetchActiveTariff(), fetchHistory(page)]);
        setIsRefreshing(false);
        toast.success("Data refreshed", {
            icon: '🔄',
            style: {
                borderRadius: '12px',
                background: '#171717',
                color: '#fff',
                border: '1px solid #262626'
            }
        });
    };

    // Modal Handlers
    const handleOpenCreateModal = () => {
        setSelectedTariff(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (tariff: TariffData) => {
        setSelectedTariff(tariff);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: any) => {
        setModalLoading(true);
        try {
            if (selectedTariff) {
                // Update
                await tariffService.updateTariff(selectedTariff._id!, data);
                toast.success("Tariff updated successfully");
            } else {
                // Create
                await tariffService.createTariff({
                    ...data,
                    isActive: false // Default to inactive as per service/backend logic usually
                });
                toast.success("Tariff created successfully");
            }
            setIsModalOpen(false);
            fetchHistory(page);
            fetchActiveTariff(); // Just in case
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Operation failed");
        } finally {
            setModalLoading(false);
        }
    };

    // Action Handlers
    const handleActivate = async (id: string) => {
        const loadingToast = toast.loading("Activating tariff...");
        try {
            await tariffService.activateTariff(id);
            toast.success("Tariff activated successfully", { id: loadingToast });
            fetchActiveTariff();
            fetchHistory(page);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Activation failed", { id: loadingToast });
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-800/50">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-[0.2em] mb-1">
                        <div className="h-1 w-8 bg-indigo-500 rounded-full"></div>
                        Administration
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Tariff <span className="text-neutral-500 font-light">Management</span>
                    </h1>
                    <p className="text-neutral-500 text-sm max-w-lg font-medium leading-relaxed">
                        Configure electricity rates and fixed charges for the system. Historical records are maintained for audit and billing consistency.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="p-3 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={handleOpenCreateModal}
                        className="flex items-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group"
                    >
                        <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                        <span>Create New Tariff</span>
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Active & Summary */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-1">
                            <Zap className="h-4 w-4 text-indigo-500" />
                            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Active Plan</h2>
                        </div>
                        <ActiveTariffCard tariff={activeTariff} loading={loadingActive} />
                    </div>

                    {/* Quick Stats / Info */}
                    <div className="p-6 bg-neutral-900/40 border border-neutral-800/50 rounded-2xl space-y-4">
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Pricing Overview</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-neutral-500 font-medium">Avg. Rate</span>
                                <span className="text-xs text-white font-bold tracking-tight">₹{activeTariff?.ratePerUnit || '0.00'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-neutral-500 font-medium">Fixed Component</span>
                                <span className="text-xs text-white font-bold tracking-tight">₹{activeTariff?.fixedCharge || '0'}</span>
                            </div>
                            <div className="pt-3 border-t border-neutral-800/50 flex items-center justify-between">
                                <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Status</span>
                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-md">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Operational</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: History Table */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-3 px-1 mb-1">
                        <RefreshCw className="h-4 w-4 text-indigo-500" />
                        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Tariff Evolution</h2>
                    </div>
                    <TariffHistoryTable
                        tariffs={history}
                        loading={loadingHistory}
                        page={page}
                        total={totalHistory}
                        limit={limit}
                        onPageChange={handlePageChange}
                        onEdit={handleOpenEditModal}
                        onActivate={handleActivate}
                    />
                </div>
            </div>

            {/* Modal */}
            <TariffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={selectedTariff}
                loading={modalLoading}
            />
        </div>
    );
};

export default Tariffs;
