import { X, MessageSquare, MapPin, AlertCircle, Check, Info } from "lucide-react";
import React from "react";
import type { Complaint } from "../../services/complaint.service";

interface ComplaintModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: Complaint | null;
    title: string;
}

const ComplaintModal = ({ isOpen, onClose, onSubmit, initialData, title }: ComplaintModalProps) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as any;
        if (initialData?._id) data.id = initialData._id;
        onSubmit(data);
    };

    const FieldLabel = ({ children, required = true }: { children: React.ReactNode, required?: boolean }) => (
        <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-neutral-500 ml-1 mb-2">
            {children}
            {required && <span className="text-red-500">*</span>}
        </label>
    );

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-2 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500 z-101">

                {/* Fixed Header */}
                <div className="flex items-center justify-between p-5 sm:p-7 border-b border-neutral-800/50 bg-neutral-900/80 backdrop-blur-sm shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">{title}</h2>
                            <p className="text-[10px] sm:text-xs font-medium text-neutral-500">Document consumer grievances and service requests.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-800 rounded-xl transition-all text-neutral-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body - Scrollable */}
                <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto p-5 sm:p-7 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">

                            {/* Consumer Reference - In a real app we might search/select consumer */}
                            <div className="md:col-span-2 space-y-2">
                                <FieldLabel>Consumer ID / Object ID</FieldLabel>
                                <div className="relative group">
                                    <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-amber-500 transition-colors" size={18} />
                                    <input
                                        name="consumerId"
                                        defaultValue={initialData?.consumerId?._id || ""}
                                        required
                                        placeholder="Enter Consumer MongoDB ID"
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-medium text-sm sm:text-base text-white"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <FieldLabel>Title / Short Summary</FieldLabel>
                                <div className="relative group">
                                    <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-amber-500 transition-colors" size={18} />
                                    <input
                                        name="Title"
                                        defaultValue={initialData?.Title}
                                        required
                                        placeholder="e.g. Broken Meter, Voltage Fluctuation"
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-amber-500 transition-all font-medium text-sm sm:text-base text-white"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <FieldLabel>Detailed Description</FieldLabel>
                                <textarea
                                    name="description"
                                    defaultValue={initialData?.description}
                                    required
                                    rows={4}
                                    placeholder="Provide full details about the complaint..."
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-all font-medium text-sm sm:text-base text-white resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <FieldLabel>Area / Locality</FieldLabel>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-amber-500 transition-colors" size={18} />
                                    <input
                                        name="area"
                                        defaultValue={initialData?.area}
                                        required
                                        placeholder="e.g. Rajajinagar"
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-amber-500 transition-all font-medium text-sm sm:text-base text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <FieldLabel>Importance Level</FieldLabel>
                                <select
                                    name="importance"
                                    defaultValue={initialData?.importance || "medium"}
                                    required
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-all font-medium text-sm sm:text-base text-white appearance-none"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <FieldLabel>City</FieldLabel>
                                <input
                                    name="city"
                                    defaultValue={initialData?.city}
                                    required
                                    placeholder="e.g. Bangalore"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-all font-medium text-sm sm:text-base text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <FieldLabel>Pincode</FieldLabel>
                                <input
                                    name="pincode"
                                    type="number"
                                    defaultValue={initialData?.pincode}
                                    required
                                    placeholder="000000"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 px-4 focus:outline-none focus:border-amber-500 transition-all font-medium font-mono text-sm sm:text-base text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="p-5 sm:p-7 border-t border-neutral-800/50 bg-neutral-900/80 backdrop-blur-sm flex gap-3 sm:gap-4 shrink-0 z-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] sm:text-xs font-black rounded-2xl transition-all active:scale-95 uppercase tracking-[0.2em]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-2 py-3.5 bg-amber-600 hover:bg-amber-500 text-white text-[10px] sm:text-xs font-black rounded-2xl transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-[0.2em]"
                        >
                            <Check size={18} />
                            {initialData?._id ? "Update Complaint" : "Submit Complaint"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComplaintModal;
