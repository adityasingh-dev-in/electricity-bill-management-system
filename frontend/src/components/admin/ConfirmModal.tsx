import React, { useEffect } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    loading = false
}) => {

    // Handle escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !loading) onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, loading]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-0">
            <div
                className="bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 w-full max-w-sm p-6 transform transition-all"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-rose-500/10 border border-rose-500/20">
                    <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                </div>

                <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-zinc-100 mb-2">{title}</h3>
                    <p className="text-sm text-zinc-400">{message}</p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-zinc-600"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-rose-600 border border-transparent rounded-lg hover:bg-rose-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-rose-500 flex items-center justify-center shadow-sm"
                    >
                        {loading ? (
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/50 mr-2"></span>
                        ) : null}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
