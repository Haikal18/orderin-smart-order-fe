import { Table } from '@/types/meja-tersedia/meja.types';
import { Card, CardContent } from '@/components/ui/card';

interface QuickStatsProps {
    tables: Table[];
}

export const QuickStats = ({ tables }: QuickStatsProps) => {
    const stats = {
        total: tables.length,
        available: tables.filter(t => t.status === 'available').length,
        occupied: tables.filter(t => t.status === 'occupied').length,
    };

    return (
        <div>
            <div className="text-base font-semibold mb-3 text-slate-800">Quick Stats</div>
            <div className="space-y-2">
                <Card className="border-slate-200">
                    <CardContent className="p-3">
                        <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                        <div className="text-xs text-slate-500">Total Tables</div>
                    </CardContent>
                </Card>
                <Card className="border-emerald-200 bg-emerald-50/50">
                    <CardContent className="p-3">
                        <div className="text-2xl font-bold text-emerald-700">{stats.available}</div>
                        <div className="text-xs text-emerald-600">Available</div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 bg-slate-50/50">
                    <CardContent className="p-3">
                        <div className="text-2xl font-bold text-slate-700">{stats.occupied}</div>
                        <div className="text-xs text-slate-600">Occupied</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
