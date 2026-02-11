import { Table, TableStatus } from '@/types/meja-tersedia/meja.types';

interface TableFloorPlanProps {
    tables: Table[];
    onTableClick?: (table: Table) => void;
}

const getTableColor = (status: TableStatus) => {
    switch (status) {
        case 'available':
            return 'bg-emerald-600 hover:bg-emerald-700';
        case 'occupied':
            return 'bg-slate-500 hover:bg-slate-600';
        case 'reserved':
            return 'bg-slate-600 hover:bg-slate-700';
        case 'inactive':
            return 'bg-slate-400 hover:bg-slate-500 cursor-not-allowed';
        default:
            return 'bg-slate-500';
    }
};

export const TableFloorPlan = ({ tables, onTableClick }: TableFloorPlanProps) => {
    const handleClick = (table: Table) => {
        if (table.status !== 'inactive' && onTableClick) {
            onTableClick(table);
        }
    };

    return (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {tables.map((table) => (
                <button
                    key={table.id}
                    onClick={() => handleClick(table)}
                    disabled={table.status === 'inactive'}
                    className={`aspect-square rounded-xl flex items-center justify-center text-white font-semibold text-base transition-all hover:scale-105 ${getTableColor(
                        table.status
                    )}`}
                >
                    {table.table_number}
                </button>
            ))}
        </div>
    );
};
