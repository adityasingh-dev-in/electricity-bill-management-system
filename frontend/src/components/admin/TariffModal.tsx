import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, AlertCircle, DollarSign, Zap } from 'lucide-react';
import type { TariffData } from '../../services/tariff.service';

interface TariffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: TariffData | null;
    loading: boolean;
}

const TariffModal: React.FC<TariffModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    loading
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            ratePerUnit: initialData?.ratePerUnit || 0,
            fixedCharge: initialData?.fixedCharge || 0
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                ratePerUnit: initialData.ratePerUnit,
                fixedCharge: initialData.fixedCharge
            });
        } else {
            reset({
                ratePerUnit: 0,
                fixedCharge: 0
            });
        }
    }, [initialData, reset, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600/10 rounded-lg">
                            <Zap className="h-5 w-5 text-indigo-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            {initialData ? 'Edit Tariff Plan' : 'Create New Tariff'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="space-y-4">
                        {/* Rate Per Unit */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">
                                Rate Per Unit (₹)
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
                                    <Zap className="h-4 w-4 text-neutral-400 group-focus-within:text-indigo-500" />
                                </div>
                                <input
                                    {...register('ratePerUnit', {
                                        required: 'Rate per unit is required',
                                        min: { value: 0, message: 'Must be at least 0' },
                                        valueAsNumber: true
                                    })}
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 5.50"
                                    className="w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-neutral-600"
                                />
                            </div>
                            {errors.ratePerUnit && (
                                <div className="flex items-center gap-1.5 text-rose-500 text-[11px] font-medium ml-1">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>{errors.ratePerUnit.message as string}</span>
                                </div>
                            )}
                        </div>

                        {/* Fixed Charge */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">
                                Fixed Charge (₹)
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
                                    <DollarSign className="h-4 w-4 text-neutral-400 group-focus-within:text-indigo-500" />
                                </div>
                                <input
                                    {...register('fixedCharge', {
                                        required: 'Fixed charge is required',
                                        min: { value: 0, message: 'Must be at least 0' },
                                        valueAsNumber: true
                                    })}
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 150.00"
                                    className="w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-neutral-600"
                                />
                            </div>
                            {errors.fixedCharge && (
                                <div className="flex items-center gap-1.5 text-rose-500 text-[11px] font-medium ml-1">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>{errors.fixedCharge.message as string}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {!initialData && (
                        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex gap-3">
                            <AlertCircle className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-indigo-300 leading-relaxed font-medium">
                                New tariffs are created as <span className="text-indigo-400 font-bold uppercase tracking-wider">Inactive</span> by default. You can activate them from the history table after creation.
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-neutral-800 text-neutral-300 rounded-xl font-bold text-sm hover:bg-neutral-700 transition-all border border-neutral-700/50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-2 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 px-8 shadow-lg shadow-indigo-500/20"
                        >
                            {loading ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {initialData ? 'Save Changes' : 'Create Tariff'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TariffModal;
