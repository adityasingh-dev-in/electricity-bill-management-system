import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../utils/api';
import { type User, UserTable } from '../../components/admin/UserTable';
import { UserModal } from '../../components/admin/UserModal';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { useDebounce } from '../../hooks/useDebounce';

const UserControl = () => {
  // State for Users
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'email'>('name');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Modals State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Users Function
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query string
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (debouncedSearchTerm) {
        params.append(searchBy, debouncedSearchTerm);
      }

      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('isActive', statusFilter);

      const response = await axiosInstance.get(`/user/fetch-users?${params.toString()}`);

      if (response.data.success) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.pagination.pages);
      } else {
        setError(response.data.message || 'Failed to fetch users');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to communicate with server');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearchTerm, roleFilter, statusFilter, searchBy]);

  // Trigger fetch on dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, roleFilter, statusFilter, searchBy]);


  // Action Handlers
  const handleEditClick = (user: User) => {
    setSelectedUserForEdit(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUserForDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateSave = async (id: string, updates: Partial<User>) => {
    try {
      const response = await axiosInstance.put(`/user/update/${id}`, updates);
      if (response.data.success) {
        // Refresh or optimistically update
        setUsers(users.map(u => u._id === id ? { ...u, ...updates } as User : u));
      }
    } catch (err) {
      throw err; // Handled by Modal
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserForDelete) return;
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/user/delete/${selectedUserForDelete._id}`);
      if (response.data.success) {
        setUsers(users.filter(u => u._id !== selectedUserForDelete._id));
        setIsDeleteModalOpen(false);
        // If last item on page is deleted and not page 1, go back a page
        if (users.length === 1 && page > 1) {
          setPage(p => p - 1);
        } else {
          await fetchUsers();
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full min-h-screen space-y-6">
      <div className="bg-zinc-900 p-5 md:p-6 rounded-2xl shadow-md border border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight mb-1">User Management</h1>
          <p className="text-sm text-zinc-400 font-medium">Manage system users, view roles, and update account statuses.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-indigo-400 bg-indigo-500/10 px-3.5 py-2 rounded-full border border-indigo-500/20 shadow-sm self-start sm:self-auto">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <span className="whitespace-nowrap">{users.length} Users Found</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 shadow-sm flex items-start">
          <svg className="w-5 h-5 mr-3 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Filters & Actions Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        {/* Search */}
        <div className="flex w-full md:max-w-md shadow-sm rounded-xl">
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value as 'name' | 'email')}
            className="bg-zinc-800 border-y border-l border-zinc-700 text-zinc-300 text-sm rounded-l-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-2.5 transition-all hover:bg-zinc-700 outline-none [&>option]:bg-zinc-800 cursor-pointer text-center font-medium"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
          </select>
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none transition-colors group-focus-within:text-indigo-400 text-zinc-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="block w-full p-2.5 pl-11 text-sm text-zinc-100 border border-zinc-700 rounded-r-xl bg-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-zinc-500 placeholder-zinc-500 focus:outline-none"
              placeholder={`Search by ${searchBy}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 lg:flex lg:flex-row gap-3 w-full lg:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 block p-2.5 shadow-sm lg:min-w-[140px] transition-all hover:border-zinc-600 font-medium w-full truncate"
          >
            <option value="">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="staff">Staff Member</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 block p-2.5 shadow-sm lg:min-w-[140px] transition-all hover:border-zinc-600 font-medium w-full truncate"
          >
            <option value="">All Status</option>
            <option value="true">Active Account</option>
            <option value="false">Inactive Account</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <UserTable
        users={users}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      {/* Pagination */}
      {!loading && users.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between border border-zinc-800 bg-zinc-900 px-4 py-3 sm:px-6 mt-6 rounded-xl shadow-md">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-zinc-400 font-medium">
                Showing <span className="text-indigo-400 font-semibold px-1">Page {page}</span> of <span className="text-zinc-100 font-semibold px-1">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-l-lg px-3 py-2 text-zinc-400 ring-1 ring-inset ring-zinc-800 hover:bg-zinc-800 focus:z-20 focus:outline-offset-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-zinc-900 border-zinc-700"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-zinc-100 ring-1 ring-inset ring-zinc-800 bg-zinc-800/50">
                  {page}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center rounded-r-lg px-3 py-2 text-zinc-400 ring-1 ring-inset ring-zinc-800 hover:bg-zinc-800 focus:z-20 focus:outline-offset-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-zinc-900 border-zinc-700"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>

          {/* Mobile pagination simple fallback */}
          <div className="flex flex-1 justify-between sm:hidden items-center">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 shadow-sm"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-zinc-400">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="relative ml-2 inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <UserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUserForEdit(null);
        }}
        user={selectedUserForEdit}
        onSave={handleUpdateSave}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUserForDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to permanently delete user "${selectedUserForDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete User"
        loading={isDeleting}
      />

    </div>
  );
};

export { UserControl };
