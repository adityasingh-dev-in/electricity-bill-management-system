import React from 'react';
import type { Complaint } from '../../services/complaint.service';
import ComplaintStatusBadge from './ComplaintStatusBadge';
import { Edit2, Trash2, CheckCircle, ExternalLink } from 'lucide-react';

interface ComplaintTableProps {
    complaints: Complaint[];
    isAdmin: boolean;
    onEdit: (complaint: Complaint) => void;
    onDelete: (id: string) => void;
    onResolve: (id: string) => void;
    onViewDetail: (id: string) => void;
    viewMode?: 'all' | 'search';
    searchTerm?: string;
    onClearSearch?: () => void;
}

const ComplaintTable: React.FC<ComplaintTableProps> = ({
    complaints,
    isAdmin,
    onEdit,
    onDelete,
    onResolve,
    onViewDetail,
    viewMode = 'all',
    searchTerm,
    onClearSearch
}) => {
    const HeaderSection = () => (
        <div className="px-6 py-4 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/50">
            <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full animate-pulse ${viewMode === 'search' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">
                    {viewMode === 'search' ? `Records for Meter: ${searchTerm}` : "Global Complaint Records"}
                </h3>
            </div>
            {viewMode === 'search' && (
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase rounded-full tracking-wider">
                        Search Results
                    </span>
                    <button
                        onClick={onClearSearch}
                        className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors underline underline-offset-4"
                    >
                        Back to Global List
                    </button>
                </div>
            )}
        </div>
    );

    if (complaints.length === 0) {
        return (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <HeaderSection />
                <div className="p-12 text-center">
                    <p className="text-neutral-400">No complaints found matching your criteria.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-neutral-900 border border-neutral-800 rounded-2xl">
            <HeaderSection />
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-neutral-800 bg-neutral-950/50">
                            <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Consumer</th>
                            <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Issue</th>
                            <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Importance</th>
                            <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                        {complaints.map((complaint) => (
                            <tr key={complaint._id} className="hover:bg-neutral-800/30 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-white">
                                            {complaint.consumerId?.name || 'Unknown'}
                                        </span>
                                        <span className="text-xs text-neutral-500">
                                            {complaint.consumerId?.meterNumber || 'N/A'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col max-w-xs">
                                        <span className="text-sm text-neutral-200 line-clamp-1 font-medium">{complaint.Title}</span>
                                        <span className="text-xs text-neutral-500 line-clamp-1">{complaint.description}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-neutral-300">{complaint.area}</span>
                                        <span className="text-xs text-neutral-500">{complaint.city}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <ComplaintStatusBadge status={complaint.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`text-xs font-medium ${complaint.importance === 'high' ? 'text-rose-400' :
                                        complaint.importance === 'medium' ? 'text-amber-400' : 'text-blue-400'
                                        }`}>
                                        {complaint.importance.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onViewDetail(complaint._id)}
                                            className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                                            title="View Details"
                                        >
                                            <ExternalLink size={18} />
                                        </button>
                                        <button
                                            onClick={() => onEdit(complaint)}
                                            className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all"
                                            title="Edit Complaint"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        {isAdmin && complaint.status === 'pending' && (
                                            <button
                                                onClick={() => onResolve(complaint._id)}
                                                className="p-2 text-neutral-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                                                title="Mark as Resolved"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        {isAdmin && (
                                            <button
                                                onClick={() => onDelete(complaint._id)}
                                                className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                                                title="Delete Complaint"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComplaintTable;
