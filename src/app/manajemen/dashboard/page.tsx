'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TableStatusLegend } from '@/components/dashboard/TableStatusLegend';
import { TableFloorPlan } from '@/components/dashboard/TableFloorPlan';
import { TableListView } from '@/components/dashboard/TableListView';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { useTables } from '@/hooks/meja-tersedia/useMeja';
import { Table } from '@/types/meja-tersedia/meja.types';
import { useNavbarSearch } from '@/context/navbarSearch';

export default function DashboardPage() {
    // Use shared navbar search state from context
    const navbarSearch = useNavbarSearch();
    const searchQuery = navbarSearch?.searchQuery ?? '';
    const setSearchQuery = navbarSearch?.setSearchQuery ?? (() => {});

    const [viewMode, setViewMode] = useState<'floor' | 'list'>('floor');

    const { data: tablesResponse, isLoading, isError, error } = useTables();
    const tables = tablesResponse?.data || [];

    const handleTableClick = (table: Table) => {
        console.log('Table clicked:', table);

    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-red-500 font-bold bg-red-100 p-4 rounded-lg">
                        Error: {(error as Error).message}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">

            <main className="p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Table Management</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant={viewMode === 'floor' ? 'default' : 'outline'}
                                        onClick={() => setViewMode('floor')}
                                        size="sm"
                                    >
                                        Floor Plan
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'outline'}
                                        onClick={() => setViewMode('list')}
                                        size="sm"
                                    >
                                        List View
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <TableStatusLegend />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    {viewMode === 'floor' ? (
                                        <TableFloorPlan 
                                            tables={tables} 
                                            onTableClick={handleTableClick}
                                        />
                                    ) : (
                                        <TableListView 
                                            tables={tables} 
                                            onTableClick={handleTableClick}
                                        />
                                    )}
                                </div>

                                <div>
                                    <QuickStats tables={tables} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    ); 
}