import { Table, TableStatus } from '@/types/meja-tersedia/meja.types';
import { cn } from '@/lib/utils';

interface TableListViewProps {
    tables: Table[];
    onTableClick?: (table: Table) => void;
}

const getStatusBadgeColor = (status: TableStatus) => {
    switch (status) {
        case 'available':
            return 'bg-emerald-100 text-emerald-700';
        case 'occupied':
            return 'bg-slate-200 text-slate-700';
        case 'reserved':
            return 'bg-slate-300 text-slate-800';
        case 'inactive':
            return 'bg-slate-100 text-slate-500';
        default:
            return 'bg-slate-200 text-slate-700';
    }
};

const getStatusLabel = (status: TableStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
};

export const TableListView = ({ tables, onTableClick }: TableListViewProps) => {
    const handleClick = (table: Table) => {
        if (table.status !== 'inactive' && onTableClick) {
            onTableClick(table);
        }
    };

    return (
        <div className="space-y-2">
            {tables.map((table) => (
                <div
                    key={table.id}
                    onClick={() => handleClick(table)}
                    className={cn(
                        "flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-slate-50 transition-colors",
                        table.status === 'inactive' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                    )}
                >
                    <div className="flex items-center gap-3">
                        <div className="font-medium text-slate-900">
                            Table {table.table_number}
                        </div>
                    </div>
                    <div className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        getStatusBadgeColor(table.status)
                    )}>
                        {getStatusLabel(table.status)}
                    </div>
                </div>
            ))}
        </div>
    );
};
