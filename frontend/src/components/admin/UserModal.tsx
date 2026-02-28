import React, { useState, useEffect } from 'react';
import type { User } from '../../services/user.service';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSave: (id: string, updates: Partial<User>) => Promise<void>;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        role: 'staff' | 'admin';
        isActive: boolean;
    }>({
        name: '',
        email: '',
        role: 'staff',
        isActive: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            });
            setError(null);
        }
    }, [user, isOpen]);

    // Handle escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !user) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await onSave(user._id, formData);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4 sm:p-0">
            <div
                className="bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 w-full max-w-md transform transition-all"
                role="dialog"
                aria-modal="true"
            >
                <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-zinc-100">Edit User Details</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-300 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-5 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg flex items-start">
                            <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border transition-colors bg-zinc-900 hover:bg-zinc-800/80 text-zinc-100 placeholder-zinc-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-zinc-700 shadow-sm focus:border-transparent focus:ring-0 sm:text-sm p-2.5 border bg-zinc-800/50 text-zinc-500 cursor-not-allowed"
                                readOnly={true}
                                title="Email cannot be changed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1">Account Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full rounded-lg border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border bg-zinc-900 transition-colors text-zinc-100 [&>option]:bg-zinc-800"
                            >
                                <option value="staff">Staff Member</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>

                        <div className="pt-2">
                            <div className="flex items-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-zinc-700 transition-colors">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="h-4 w-4 bg-zinc-900 border-zinc-700 rounded text-indigo-500 focus:ring-indigo-500 focus:ring-offset-zinc-900 cursor-pointer"
                                />
                                <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-zinc-300 cursor-pointer flex-1">
                                    Active Account
                                    <p className="text-zinc-500 text-xs font-normal mt-0.5">Allow this user to log in and use the system.</p>
                                </label>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-zinc-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 text-sm font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-zinc-600"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500 flex items-center shadow-sm"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/50 mr-2"></span>
                                ) : null}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
