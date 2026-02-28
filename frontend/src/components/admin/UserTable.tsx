import React from 'react';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'staff';
    isActive: boolean;
    createdAt: string;
}

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    loading: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, loading }) => {
    if (loading && users.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!loading && users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400 bg-zinc-900 rounded-xl shadow-md border border-zinc-800">
                <svg className="w-12 h-12 text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <span className="text-base font-medium text-zinc-300">No users found</span>
                <span className="text-sm mt-1">Try adjusting your filters</span>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900 rounded-xl shadow-md border border-zinc-800 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left text-zinc-400">
                    <thead className="text-xs text-zinc-300 uppercase bg-zinc-800/50 border-b border-zinc-800">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Joined</th>
                            <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                        {users.map((user) => (
                            <tr key={user._id} className="bg-zinc-900 hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-zinc-100">{user.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-zinc-400">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border inline-block ${user.role === 'admin'
                                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border inline-flex items-center w-max ${user.isActive
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shadow-[0_0_8px] leading-none ${user.isActive ? 'bg-emerald-400 shadow-emerald-400/60' : 'bg-rose-400 shadow-rose-400/60'}`}></span>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-zinc-500 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(user)}
                                        className="font-medium text-rose-400 hover:text-rose-300 transition-colors px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden flex flex-col divide-y divide-zinc-800/80">
                {users.map((user) => (
                    <div key={user._id} className="p-5 bg-zinc-900 hover:bg-zinc-800/30 transition-colors flex flex-col gap-4">
                        <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-zinc-100 text-base truncate">{user.name}</h3>
                                <p className="text-sm text-zinc-400 truncate mt-0.5">{user.email}</p>
                            </div>
                            <span className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-semibold border inline-flex items-center ${user.isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shadow-[0_0_8px] leading-none ${user.isActive ? 'bg-emerald-400 shadow-emerald-400/60' : 'bg-rose-400 shadow-rose-400/60'}`}></span>
                                {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-zinc-500">Role:</span>
                                <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border inline-block ${user.role === 'admin'
                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-500">
                                <span>Joined:</span>
                                <span className="text-zinc-300">
                                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-3 border-t border-zinc-800/50 mt-1">
                            <button
                                onClick={() => onEdit(user)}
                                className="flex-1 font-medium text-indigo-400 hover:text-indigo-300 transition-colors py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(user)}
                                className="flex-1 font-medium text-rose-400 hover:text-rose-300 transition-colors py-2.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl text-sm flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
