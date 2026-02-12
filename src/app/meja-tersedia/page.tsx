"use client";

import { useTables } from "@/hooks/meja-tersedia/useMeja";
import { TableCard } from "@/components/meja-tersedia/table-card";
import { StatusLegend } from "@/components/meja-tersedia/status-legend";
import { useNavbarSearch } from '@/context/navbarSearch';

export default function MejaTersediaPage() {
    const navbarSearch = useNavbarSearch();
    const searchQuery = navbarSearch?.searchQuery ?? '';

    const { data: tablesResponse, isLoading, isError, error } = useTables({ search: searchQuery });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900 shadow-md"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 font-bold text-lg bg-red-100 p-4 rounded-lg shadow-sm">
                    Error: {(error as Error).message}
                </div>
            </div>
        );
    }

    const tables = tablesResponse?.data || [];

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-slate-800 text-center md:text-left">Meja Tersedia</h1>
            
            <StatusLegend />

            {tables.length === 0 ? (
                <div className="text-center text-slate-500 text-lg mt-10">
                    No tables found.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {tables.map((table) => (
                        <TableCard key={table.id} table={table} />
                    ))}
                </div>
            )}
        </div>
    );
}
