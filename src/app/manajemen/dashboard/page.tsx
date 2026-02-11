'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type TableStatus = 'available' | 'occupied' | 'reserved' | 'inactive';

interface Table {
    id: number;
    status: TableStatus;
}

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'floor' | 'list'>('floor');

    const tables: Table[] = Array.from({ length: 24 }, (_, i) => ({
        id: i + 1,
        status: i < 12 ? 'available' : i < 20 ? 'occupied' : i < 23 ? 'reserved' : 'inactive',
    }));

    const stats = {
        available: tables.filter(t => t.status === 'available').length,
        occupied: tables.filter(t => t.status === 'occupied').length,
        reserved: tables.filter(t => t.status === 'reserved').length,
        inactive: tables.filter(t => t.status === 'inactive').length,
    };

    const getTableColor = (status: TableStatus) => {
        switch (status) {
            case 'available':
                return 'bg-slate-500 hover:bg-slate-600';
            case 'occupied':
                return 'bg-slate-700 hover:bg-slate-800';
            case 'reserved':
                return 'bg-slate-600 hover:bg-slate-700';
            case 'inactive':
                return 'bg-slate-400 hover:bg-slate-500';
            default:
                return 'bg-slate-500';
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            <header className="border-b bg-white dark:bg-zinc-950 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded font-bold">
                            RestaurantPOS
                        </div>
                        <div className="relative">
                            <Input
                                type="search"
                                placeholder="Search table..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-sm">
                            <div className="font-medium">{user?.name || 'Server'}</div>
                            <div className="text-zinc-500">{user?.role || 'Server'}</div>
                        </div>
                        <Button variant="outline" onClick={logout} size="sm">
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-6">
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
                            <div className="mb-6">
                                <div className="text-sm font-medium mb-2">Table Status</div>
                                <div className="flex gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-slate-500"></div>
                                        <span>Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-slate-700"></div>
                                        <span>Occupied</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-slate-600"></div>
                                        <span>Reserved</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-slate-400"></div>
                                        <span>Inactive</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid grid-cols-6 gap-3">
                                    {tables.map((table) => (
                                        <button
                                            key={table.id}
                                            className={`aspect-square rounded-lg flex items-center justify-center text-white font-medium transition-colors ${getTableColor(
                                                table.status
                                            )}`}
                                        >
                                            {table.id}
                                        </button>
                                    ))}
                                </div>

                                <div>
                                    <div className="text-lg font-semibold mb-4">Quick Stats</div>
                                    <div className="space-y-3">
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-2xl font-bold">{stats.available}</div>
                                                <div className="text-sm text-zinc-500">Available Tables</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-2xl font-bold">{stats.occupied}</div>
                                                <div className="text-sm text-zinc-500">Occupied Tables</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-2xl font-bold">{stats.reserved}</div>
                                                <div className="text-sm text-zinc-500">Reserved Tables</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-2xl font-bold">{stats.inactive}</div>
                                                <div className="text-sm text-zinc-500">Inactive Tables</div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
