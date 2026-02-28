import { X, User, Phone, Hash, Check } from "lucide-react";
import React from "react";
import type { Consumer } from "../../services/consumer.service";

interface ConsumerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Consumer>) => void;
    initialData?: Consumer | null;
    title: string;
}

const ConsumerModal = ({ isOpen, onClose, onSubmit, initialData, title }: ConsumerModalProps) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as any;
        if (initialData?._id) data._id = initialData._id;
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
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-500 z-100">

                {/* Fixed Header */}
                <div className="flex items-center justify-between p-5 sm:p-7 border-b border-neutral-800/50 bg-neutral-900/80 backdrop-blur-sm shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">{title}</h2>
                            <p className="text-[10px] sm:text-xs font-medium text-neutral-500">Provide accurate details for the utility account.</p>
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
                            {/* Primary Info */}
                            <div className="md:col-span-2 space-y-2">
                                <FieldLabel>Full Legal Name</FieldLabel>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input
                                        name="name"
                                        defaultValue={initialData?.name}
                                        required
                                        placeholder="e.g. Aditya Singh"
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm sm:text-base text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <FieldLabel>Phone Number</FieldLabel>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input
                                        name="phone"
                                        type="tel"
                                        defaultValue={initialData?.phone}
                                        required
                                        placeholder="+91 00000 00000"
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm sm:text-base text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <FieldLabel>Meter Number</FieldLabel>
                                <div className="relative group">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input
                                        name="meterNumber"
                                        defaultValue={initialData?.meterNumber}
                                        required
                                        placeholder="882910"
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm sm:text-base text-white"
                                    />
                                </div>
                            </div>

                            {/* Address Block */}
                            <div className="md:col-span-2 pt-4 border-t border-neutral-800/50">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <FieldLabel>House/Flat No.</FieldLabel>
                                        <input
                                            name="houseNumber"
                                            defaultValue={initialData?.houseNumber}
                                            required
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm sm:text-base text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FieldLabel>Area / Street</FieldLabel>
                                        <input
                                            name="area"
                                            defaultValue={initialData?.area}
                                            required
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm sm:text-base text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FieldLabel>City</FieldLabel>
                                        <input
                                            name="city"
                                            defaultValue={initialData?.city}
                                            required
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm sm:text-base text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FieldLabel>State</FieldLabel>
                                        <input
                                            name="state"
                                            defaultValue={initialData?.state}
                                            required
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm sm:text-base text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FieldLabel>Pincode</FieldLabel>
                                        <input
                                            name="pincode"
                                            defaultValue={initialData?.pincode}
                                            required
                                            placeholder="000000"
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-all font-medium font-mono text-sm sm:text-base text-white"
                                        />
                                    </div>
                                </div>
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
                            Discard
                        </button>
                        <button
                            type="submit"
                            className="flex-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] sm:text-xs font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-[0.2em]"
                        >
                            <Check size={18} />
                            {initialData?._id ? "Update Account" : "Finalize & Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConsumerModal;
