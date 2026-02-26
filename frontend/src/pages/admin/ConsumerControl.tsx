import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";
import ConsumerFilters from "../../components/consumer/ConsumerFilters";
import ConsumerCard from "../../components/consumer/ConsumerCard";
import ConsumerModal from "../../components/consumer/ConsumerModal";
import { ChevronLeft, ChevronRight, Loader2, Users } from "lucide-react";

interface Consumer {
    _id: string;
    name: string;
    phone: string;
    houseNumber: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    meterNumber: string;
}

interface Pagination {
    total: number;
    page: number;
    pages: number;
    hasNextPage: boolean;
}

const ConsumerControl = () => {
    const [consumers, setConsumers] = useState<Consumer[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, pages: 1, hasNextPage: false });
    const [filters, setFilters] = useState({
        name: "",
        meterNumber: "",
        phone: "",
        city: "",
        sortBy: "createdAt"
    });

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: "add" | "edit";
        data: Consumer | null;
    }>({
        isOpen: false,
        type: "add",
        data: null
    });

    const fetchConsumers = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                page,
                limit: 12
            };
            const response = await api.get("/consumer", { params });
            if (response.data?.success) {
                setConsumers(response.data.data.consumers);
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            console.error("Failed to fetch consumers:", error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchConsumers(1);
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [fetchConsumers]);

    const handleAdd = () => {
        setModalState({ isOpen: true, type: "add", data: null });
    };

    const handleEdit = (consumer: Consumer) => {
        setModalState({ isOpen: true, type: "edit", data: consumer });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this consumer?")) {
            try {
                const response = await api.delete(`/consumer/${id}`);
                if (response.data?.success) {
                    fetchConsumers(pagination.page);
                }
            } catch (error) {
                console.error("Failed to delete consumer:", error);
            }
        }
    };

    const handleModalSubmit = async (data: any) => {
        try {
            let response;
            if (modalState.type === "edit" && modalState.data?._id) {
                response = await api.put(`/consumer/${modalState.data._id}`, data);
            } else {
                response = await api.post("/consumer", data);
            }

            if (response.data?.success) {
                setModalState({ isOpen: false, type: "add", data: null });
                fetchConsumers(pagination.page);
            }
        } catch (error) {
            console.error("Failed to save consumer:", error);
            alert("Error saving consumer. Please check your data.");
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Consumer Control</h1>
                    <p className="text-neutral-500 font-medium">Manage and monitor consumer accounts and their active services.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
                    <Users size={14} className="text-indigo-500" />
                    Total: {pagination.total} Consumers
                </div>
            </div>

            <ConsumerFilters
                filters={filters}
                onSearch={setFilters}
                onAddClick={handleAdd}
            />

            {loading ? (
                <div className="h-96 flex flex-col items-center justify-center gap-4 text-neutral-500">
                    <Loader2 className="animate-spin text-indigo-500" size={40} />
                    <p className="font-medium animate-pulse">Fetching consumers...</p>
                </div>
            ) : consumers.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {consumers.map((consumer) => (
                            <ConsumerCard
                                key={consumer._id}
                                consumer={consumer}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-center gap-4 py-6">
                            <button
                                onClick={() => fetchConsumers(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="p-2 border border-neutral-800 rounded-xl hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => fetchConsumers(p)}
                                        className={clsx(
                                            "h-10 w-10 rounded-xl font-bold transition-all active:scale-95",
                                            pagination.page === p
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                                : "text-neutral-500 hover:bg-neutral-800"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => fetchConsumers(pagination.page + 1)}
                                disabled={!pagination.hasNextPage}
                                className="p-2 border border-neutral-800 rounded-xl hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="h-96 bg-neutral-900/50 border border-neutral-800 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-neutral-500 gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-neutral-800 flex items-center justify-center">
                        <Users size={32} />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-neutral-300">No consumers found</p>
                        <p className="text-sm">Try adjusting your filters or add a new consumer.</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="mt-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                    >
                        Add your first consumer
                    </button>
                </div>
            )}

            <ConsumerModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ ...modalState, isOpen: false })}
                onSubmit={handleModalSubmit}
                initialData={modalState.data}
                title={modalState.type === "edit" ? "Edit Consumer Details" : "Add New Consumer"}
            />
        </div>
    );
};

// Helper for conditional classes if clsx is not imported or needed simply here
function clsx(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default ConsumerControl;
