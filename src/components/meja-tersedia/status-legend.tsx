import { cn } from "@/lib/utils";

interface StatusItem {
    label: string;
    color: string;
}

const statusItems: StatusItem[] = [
    { label: "Available", color: "bg-emerald-600" },
    { label: "Occupied", color: "bg-slate-500" },
];

export const StatusLegend = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Table Status</h2>
            <div className="flex flex-wrap gap-4">
                {statusItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className={cn("w-4 h-4 rounded", item.color)} />
                        <span className="text-sm text-slate-600">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
