import React from 'react';

interface ComplaintStatusBadgeProps {
    status: 'pending' | 'resolved';
}

const ComplaintStatusBadge: React.FC<ComplaintStatusBadgeProps> = ({ status }) => {
    const isResolved = status === 'resolved';

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${isResolved
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                }`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default ComplaintStatusBadge;
