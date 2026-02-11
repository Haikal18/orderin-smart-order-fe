import { cn } from "@/lib/utils";

interface StatusItem {
    label: string;
    color: string;
}

const statusItems: StatusItem[] = [
    { label: "Available", color: "bg-emerald-600" },
    { label: "Occupied", color: "bg-slate-500" },
];

interface TableStatusLegendProps {
    showReserved?: boolean;
    showInactive?: boolean;
}

export const TableStatusLegend = ({ 
    showReserved = true, 
    showInactive = true 
}: TableStatusLegendProps) => {
    const filteredItems = statusItems.filter(item => {
        if (!showReserved && item.label === "Reserved") return false;
        if (!showInactive && item.label === "Inactive") return false;
        return true;
    });

    return (
        <div className="mb-4">
            <div className="text-sm font-medium mb-2 text-slate-700">Table Status</div>
            <div className="flex gap-4 text-sm">
                {filteredItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className={cn("w-4 h-4 rounded", item.color)} />
                        <span className="text-slate-600">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
