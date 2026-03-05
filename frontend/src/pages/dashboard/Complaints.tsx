
import { useState, useEffect, useContext, useCallback } from 'react';
import { Plus, RefreshCw, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import complaintService, { type Complaint, type ComplaintQueryParams, type FetchComplaintsResponse } from '../../services/complaint.service';
import ComplaintTable from '../../components/complaints/ComplaintTable';
import ComplaintFilters from '../../components/complaints/ComplaintFilters';
import ComplaintModal from '../../components/complaints/ComplaintModal';
import ComplaintDetailModal from '../../components/complaints/ComplaintDetailModal';
import { UserContext } from '../../context/user.context';

const Complaints = () => {
    const context = useContext(UserContext);
    const user = context?.user;
    const isAdmin = user?.role === 'admin';

    // State
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<FetchComplaintsResponse['pagination']>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });
    const [filters, setFilters] = useState<ComplaintQueryParams>({
        page: 1,
        limit: 10
    });

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

    // Fetch Complaints
    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        try {
            // Check if we are searching by meter number specifically
            if ((filters as any).meterNumber) {
                const results = await complaintService.getConsumerComplaints((filters as any).meterNumber);
                setComplaints(results);
                setPagination({
                    total: results.length,
                    page: 1,
                    limit: results.length || 10,
                    totalPages: 1
                });
            } else {
                const data = await complaintService.getAllComplaints(filters);
                setComplaints(data.complaints);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error("Error fetching complaints:", error);
            if ((filters as any).meterNumber) {
                alert("No consumer found or error searching by meter number.");
            }
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    // Handlers
    const handleFilterChange = (newFilters: ComplaintQueryParams | { meterNumber: string | null }) => {
        setFilters(prev => {
            const updated = { ...prev, ...newFilters, page: 1 };
            // If meterNumber is explicitly set to null, remove it from the state
            if ((newFilters as any).meterNumber === null) {
                delete (updated as any).meterNumber;
            }
            return updated;
        });
    };

    const handleClearFilters = () => {
        setFilters({ page: 1, limit: 10 });
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleCreateComplaint = () => {
        setSelectedComplaint(null);
        setIsModalOpen(true);
    };

    const handleEditComplaint = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    const handleSubmitModal = async (data: any) => {
        try {
            if (selectedComplaint) {
                await complaintService.updateComplaint({ ...data, id: selectedComplaint._id });
            } else {
                await complaintService.createComplaint(data);
            }
            setIsModalOpen(false);
            fetchComplaints();
        } catch (error) {
            console.error("Error submitting complaint:", error);
            alert("Failed to save complaint. Please check your inputs.");
        }
    };

    const handleDeleteComplaint = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this complaint?")) return;
        try {
            await complaintService.deleteComplaint(id);
            fetchComplaints();
        } catch (error) {
            console.error("Error deleting complaint:", error);
        }
    };

    const handleResolveComplaint = async (id: string) => {
        try {
            await complaintService.updateStatus(id, 'resolved');
            fetchComplaints();
        } catch (error) {
            console.error("Error resolving complaint:", error);
        }
    };

    const handleViewDetail = async (id: string) => {
        setLoading(true);
        try {
            const detail = await complaintService.getComplaintById(id);
            setSelectedComplaint(detail);
            setIsDetailOpen(true);
        } catch (error) {
            console.error("Error fetching complaint detail:", error);
            alert("Failed to fetch complaint details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-12">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                                <MessageSquare size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Complaints & Support</h1>
                        </div>
                        <p className="text-sm sm:text-base text-neutral-500 font-medium max-w-lg">
                            Manage and resolve consumer grievances effectively and track staff responses.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                        <button
                            onClick={() => fetchComplaints()}
                            className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-400 hover:text-white hover:border-neutral-700 transition-all active:scale-95 shrink-0"
                            title="Refresh Data"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button
                            onClick={handleCreateComplaint}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black rounded-2xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 text-xs sm:text-sm uppercase tracking-wider shrink-0"
                        >
                            <Plus size={18} strokeWidth={3} />
                            New Complaint
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <ComplaintFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                {/* Content Table */}
                <div className="relative">
                    {loading && (
                        <div className="absolute inset-0 bg-neutral-950/20 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
                            <RefreshCw size={32} className="text-amber-500 animate-spin" />
                        </div>
                    )}

                    <ComplaintTable
                        complaints={complaints}
                        isAdmin={isAdmin}
                        onEdit={handleEditComplaint}
                        onDelete={handleDeleteComplaint}
                        onResolve={handleResolveComplaint}
                        onViewDetail={handleViewDetail}
                        viewMode={(filters as any).meterNumber ? 'search' : 'all'}
                        searchTerm={(filters as any).meterNumber}
                        onClearSearch={handleClearFilters}
                    />

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between px-2">
                            <p className="text-sm font-medium text-neutral-500">
                                Showing <span className="text-white">{complaints.length}</span> of <span className="text-white">{pagination.total}</span> complaints
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex items-center gap-1">
                                    {[...Array(pagination.totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`h-10 w-10 flex items-center justify-center rounded-xl font-bold transition-all ${pagination.page === i + 1
                                                ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
                                                : 'bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-700'
                                                }`}
                                        >    {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Submit/Edit Modal */}
            <ComplaintModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitModal}
                initialData={selectedComplaint}
                title={selectedComplaint ? "Edit Complaint" : "File New Complaint"}
            />

            {/* Detail Modal */}
            <ComplaintDetailModal
                isOpen={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedComplaint(null);
                }}
                complaint={selectedComplaint}
            />
        </div>
    );
};

export default Complaints;

