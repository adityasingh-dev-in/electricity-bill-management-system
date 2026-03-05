import { X, User, ShieldCheck, MapPin, AlertCircle, Calendar, Hash, Phone, Mail, MessageSquare } from "lucide-react";
import React from "react";
import type { Complaint } from "../../services/complaint.service";
import ComplaintStatusBadge from "./ComplaintStatusBadge";

interface ComplaintDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    complaint: Complaint | null;
}

const ComplaintDetailModal = ({ isOpen, onClose, complaint }: ComplaintDetailModalProps) => {
    if (!isOpen || !complaint) return null;

    const DetailSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                <Icon size={16} className="text-amber-500" />
                <h3 className="text-[11px] font-black uppercase tracking-widest text-neutral-400">{title}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );

    const DetailItem = ({ label, value, icon: Icon }: { label: string, value: string | number | React.ReactNode, icon?: any }) => (
        <div className="space-y-1">
            <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-tighter">{label}</span>
            <div className="flex items-center gap-2">
                {Icon && <Icon size={14} className="text-neutral-600" />}
                <span className="text-sm font-semibold text-neutral-200">{value || "N/A"}</span>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-2 sm:p-4">
            <div
                className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-3xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500 z-101">

                {/* Header */}
                <div className="flex items-center justify-between p-5 sm:p-7 border-b border-neutral-800/50 bg-neutral-900/80 backdrop-blur-sm shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white line-clamp-1">{complaint.Title}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <ComplaintStatusBadge status={complaint.status} />
                                <span className="text-[10px] font-medium text-neutral-500 uppercase">Filed on {new Date(complaint.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-800 rounded-xl transition-all text-neutral-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-7 custom-scrollbar space-y-8">

                    {/* Description Block */}
                    <div className="bg-neutral-950/50 border border-neutral-800 rounded-2xl p-4 sm:p-6 space-y-2">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Complaint Description</h4>
                        <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                            {complaint.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Consumer Details */}
                        <DetailSection title="Consumer Information" icon={User}>
                            <DetailItem label="Full Name" value={complaint.consumerId?.name} icon={User} />
                            <DetailItem label="Meter Number" value={complaint.consumerId?.meterNumber} icon={Hash} />
                        </DetailSection>

                        {/* Created By Section */}
                        <DetailSection title="Staff Information" icon={ShieldCheck}>
                            <DetailItem label="Handled By" value={complaint.createdBy?.name} icon={User} />
                            <DetailItem label="Staff Email" value={complaint.createdBy?.email} icon={Mail} />
                        </DetailSection>

                        {/* Location Details */}
                        <DetailSection title="Location" icon={MapPin}>
                            <DetailItem label="Area" value={complaint.area} icon={MapPin} />
                            <DetailItem label="City" value={complaint.city} />
                            <DetailItem label="Pincode" value={complaint.pincode} />
                        </DetailSection>

                        {/* Metadata */}
                        <DetailSection title="Metadata" icon={AlertCircle}>
                            <DetailItem label="Importance" value={complaint.importance.toUpperCase()} />
                            <DetailItem label="Resolved At" value={complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleString() : "Pending"} icon={Calendar} />
                        </DetailSection>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 sm:p-7 border-t border-neutral-800/50 bg-neutral-900/80 backdrop-blur-sm flex justify-end shrink-0 z-10">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] sm:text-xs font-black rounded-2xl transition-all active:scale-95 uppercase tracking-[0.2em]"
                    >
                        Close View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetailModal;
