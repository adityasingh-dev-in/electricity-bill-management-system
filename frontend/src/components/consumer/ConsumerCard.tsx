import { useState, useRef, useEffect } from "react";
import { MapPin, Phone, Hash, MoreVertical, Edit2, Trash2, Receipt, Globe } from "lucide-react";
import { clsx } from "clsx";
import type { Consumer } from "../../services/consumer.service";

interface ConsumerCardProps {
    consumer: Consumer;
    onEdit: (consumer: Consumer) => void;
    onDelete: (id: string) => void;
}

const ConsumerCard = ({ consumer, onEdit, onDelete }: ConsumerCardProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 hover:border-indigo-500/30 transition-all group relative">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-linear-to-tr from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-black text-2xl border border-indigo-500/10 shadow-inner">
                        {consumer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-black text-xl tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-1">{consumer.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-800 border border-neutral-700/50 text-neutral-400">
                                <Hash size={12} className="text-indigo-500" />
                                <span className="font-mono text-[11px] font-bold uppercase tracking-wider">{consumer.meterNumber}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={clsx(
                            "p-2 rounded-xl transition-all duration-200 border",
                            isMenuOpen ? "bg-indigo-600 border-indigo-500 text-white" : "border-neutral-800 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
                        )}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-1.5 space-y-1">
                                <button
                                    onClick={() => { onEdit(consumer); setIsMenuOpen(false); }}
                                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-bold text-neutral-300 hover:bg-neutral-800 hover:text-indigo-400 rounded-xl transition-all"
                                >
                                    <Edit2 size={16} /> Edit Details
                                </button>
                                <button className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-bold text-neutral-300 hover:bg-neutral-800 hover:text-indigo-400 rounded-xl transition-all">
                                    <Receipt size={16} /> View Bills
                                </button>
                                <div className="h-px bg-neutral-800 mx-1" />
                                <button
                                    onClick={() => { onDelete(consumer._id); setIsMenuOpen(false); }}
                                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-neutral-500 ml-0.5">
                        <MapPin size={10} /> Address
                    </div>
                    <div className="p-3 bg-neutral-950/50 border border-neutral-800/50 rounded-2xl">
                        <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                            {consumer.houseNumber}, {consumer.area}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                            <Globe size={12} />
                            {consumer.city}, {consumer.state} - {consumer.pincode}
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-neutral-500 ml-0.5">
                        <Phone size={10} /> Contact & Support
                    </div>
                    <div className="p-3 bg-neutral-950/50 border border-neutral-800/50 rounded-2xl flex items-center justify-between">
                        <span className="text-sm font-bold text-neutral-300">{consumer.phone}</span>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex-1 py-2 rounded-xl bg-neutral-800/50 border border-neutral-800 text-center text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Domestic
                </div>
                <div className="flex-1 py-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-center text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    Active
                </div>
            </div>
        </div>
    );
};

export default ConsumerCard;
