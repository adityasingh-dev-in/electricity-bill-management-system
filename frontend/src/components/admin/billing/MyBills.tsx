import { useState, useEffect } from 'react';
import useUser from '../../../hooks/useUser';
import billService from '../../../services/bill.service';
import type { Bill } from '../../../services/bill.service';
import { BillTable } from './BillTable';
import { BillFilters } from './BillFilters';

interface MyBillsProps {
    onViewDetails: (bill: Bill) => void;
    onDownloadPDF: (bill: Bill) => void;
    onUpdateStatus: (id: string, status: string) => void;
    onDelete: (id: string) => void;
}

export const MyBills = ({
    onViewDetails,
    onDownloadPDF,
    onUpdateStatus,
    onDelete
}: MyBillsProps) => {
    const { user } = useUser();
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        month: '',
        year: '',
        status: ''
    });

    useEffect(() => {
        if (user?._id) {
            fetchMyBills();
        }
    }, [user?._id, filters]);

    const fetchMyBills = async () => {
        setLoading(true);
        try {
            const response = await billService.getMyBills({
                ...filters,
                year: filters.year ? Number(filters.year) : undefined
            });
            setBills(response.data.bills);
        } catch (error) {
            console.error('Failed to fetch my bills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="bg-zinc-950/50 p-4 sm:p-6 rounded-2xl border border-zinc-800/50">
                <div className="mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-zinc-100">My Generated Bills</h2>
                    <p className="text-xs sm:text-sm text-zinc-500">Showing bills you've created.</p>
                </div>
                <BillFilters filters={filters} onFilterChange={handleFilterChange} />
                <BillTable
                    bills={bills}
                    loading={loading}
                    onViewDetails={onViewDetails}
                    onDownloadPDF={onDownloadPDF}
                    onUpdateStatus={onUpdateStatus}
                    onDelete={onDelete}
                />
            </div>
        </div>
    );
};
