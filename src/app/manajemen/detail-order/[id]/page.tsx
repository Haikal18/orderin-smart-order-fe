'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useOrderDetail } from '@/hooks/order/useOrderDetail';
import { OrderItemList } from '@/components/order-detail/OrderItemList';
import { PaymentCard } from '@/components/order-detail/PaymentCard';
import { OrderActions } from '@/components/order-detail/OrderActions';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
    const router = useRouter();
    const { id } = use(params);
    const orderId = Number(id);
    const [customerPayment, setCustomerPayment] = useState<string>('');

    const { data: order, isLoading, isError, error } = useOrderDetail(orderId);

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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

    if (isError || !order) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-red-500 font-bold bg-red-100 p-4 rounded-lg">
                        Error: {error ? (error as Error).message : 'Order not found'}
                    </div>
                </div>
            </div>
        );
    }

    // Filter only sent items
    const sentItems = order.items.filter(item => item.status === 'sent');

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            <div className="container mx-auto px-4 py-6">
                {/* Header with Back Button */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali
                    </Button>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Detail Order - Meja {order.table.table_number}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        {order.order_number} • {formatDateTime(order.opened_at)}
                    </p>
                </div>

                {/* Order Info Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Informasi Order</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-slate-500">Meja</p>
                                <p className="font-semibold text-slate-900">
                                    {order.table.table_number}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Kapasitas</p>
                                <p className="font-semibold text-slate-900">
                                    {order.table.capacity} orang
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Pelayan</p>
                                <p className="font-semibold text-slate-900">
                                    {order.pelayan.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Status</p>
                                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                                    {order.status === 'open' ? 'Open' : 'Closed'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content: Items + Payment */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Side: Order Items */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Item Pesanan ({sentItems.length} item)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {sentItems.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500">
                                            Belum ada item yang dikirim
                                        </p>
                                    </div>
                                ) : (
                                    <OrderItemList items={sentItems} />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Payment Card */}
                    <div className="lg:col-span-1">
                        <PaymentCard
                            totalAmount={parseFloat(String(order.total_amount))}
                            customerPayment={customerPayment}
                            onCustomerPaymentChange={setCustomerPayment}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <OrderActions
                                orderId={order.id}
                                customerPayment={customerPayment}
                                totalAmount={parseFloat(String(order.total_amount))}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
