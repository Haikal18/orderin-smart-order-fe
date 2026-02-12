'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderTableGrid } from '@/components/order-detail/OrderTableGrid';
import { OrderTableList } from '@/components/order-detail/OrderTableList';
import { useOrders } from '@/hooks/order/useOrders';
import { OrderListItem } from '@/types/order/order.types';

export default function DetailOrderPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'floor' | 'list'>('floor');

    const { data: ordersResponse, isLoading, isError, error } = useOrders('open');
    const orders = ordersResponse?.data || [];

    const handleOrderClick = (order: OrderListItem) => {
        router.push(`/manajemen/detail-order/${order.id}`);
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
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Detail Order
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Kelola pembayaran dan penutupan order
                    </p>
                </div>

                {/* View Mode Toggle */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Meja Terisi ({orders.length})</span>
                            <div className="flex gap-2">
                                <Button
                                    variant={viewMode === 'floor' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('floor')}
                                >
                                    Grid View
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    List View
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-500">Tidak ada meja yang terisi</p>
                            </div>
                        ) : (
                            <>
                                {viewMode === 'floor' ? (
                                    <OrderTableGrid
                                        orders={orders}
                                        onOrderClick={handleOrderClick}
                                    />
                                ) : (
                                    <OrderTableList
                                        orders={orders}
                                        onOrderClick={handleOrderClick}
                                    />
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Legend */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-500 text-white">
                        <div className="w-4 h-4 bg-slate-500 rounded"></div>
                        <span className="text-sm font-medium">Occupied (Open Order)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
