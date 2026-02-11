import { Table } from "@/types/meja-tersedia/meja.types";
import { cn } from "@/lib/utils";

interface TableCardProps {
    table: Table;
}

export const TableCard = ({ table }: TableCardProps) => {
    return (
        <div
            className={cn(
                "flex items-center justify-center rounded-lg shadow-md aspect-video text-white font-medium text-lg transition-all hover:scale-105",
                table.status === "available"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : table.status === "occupied"
                    ? "bg-slate-500 hover:bg-slate-600"
                    : "bg-slate-400 cursor-not-allowed"
            )}
        >
            {table.table_number}
        </div>
    );
};
