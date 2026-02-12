'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useOrderDetail } from '@/hooks/order/useOrderItems';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddItemModal from '@/components/orders/AddItemModal';

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = Number(params.id);

    const [addItemModalOpen, setAddItemModalOpen] = useState(false);

    const { data, isLoading, isError, error } = useOrderDetail(orderId);
    const order = data?.data;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                <div className="text-red-500 font-bold bg-red-100 p-4 rounded-lg">
                    Error: {error instanceof Error ? error.message : 'Order not found'}
                </div>
            </div>
        );
    }

    const items = order.items || [];
    const totalAmount = order.total_amount || items.reduce((sum, item) => sum + item.subtotal, 0);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {order.table?.table_number || `Table ${order.table_id}`}
                        </h1>
                        <p className="text-sm text-gray-500">{order.order_number}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Menu Items */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Items</CardTitle>
                                    <Button onClick={() => setAddItemModalOpen(true)} size="sm">
                                        + Add Item
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {items.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        Belum ada item. Tambahkan item pertama Anda!
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <h3 className="font-medium">{item.food_name}</h3>
                                                    <p className="text-sm text-gray-500">{item.category}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-center">
                                                        <div className="text-sm text-gray-500">Qty</div>
                                                        <div className="font-medium">{item.qty}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-500">
                                                            Rp {item.price.toLocaleString('id-ID')}
                                                        </div>
                                                        <div className="font-semibold">
                                                            Rp {item.subtotal.toLocaleString('id-ID')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Current Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Current Order</CardTitle>
                                <p className="text-sm text-gray-500">
                                    {order.table?.table_number || `Table ${order.table_id}`} •{' '}
                                    {new Date(order.opened_at).toLocaleDateString('id-ID')}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Order Items Summary */}
                                <div className="space-y-2">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>
                                                {item.food_name} x {item.qty}
                                            </span>
                                            <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                                        </div>
                                    ))}
                                </div>

                                {items.length > 0 && (
                                    <>
                                        <div className="border-t pt-3">
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Total</span>
                                                <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="space-y-2 pt-3">
                                            <Button className="w-full" size="lg">
                                                🍴 Send to Kitchen
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Add Item Modal */}
                <AddItemModal
                    open={addItemModalOpen}
                    onOpenChange={setAddItemModalOpen}
                    orderId={orderId}
                />
            </div>
        </div>
    );
}
