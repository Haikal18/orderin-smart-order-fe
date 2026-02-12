'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import { 
    useOrderDetail, 
    useAddOrderItem,
    useSendDraftItems,
} from '@/hooks/order/useOrderItems';
import { useFoods } from '@/hooks/food/useFoods';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import MenuItemCard from '@/components/orders/MenuItemCard';
import CategoryTabs from '@/components/orders/CategoryTabs';
import CartItem from '@/components/orders/CartItem';
import LocalDraftCartItem from '@/components/orders/LocalDraftCartItem';
import { FoodCategory } from '@/types/food/food.types';
import { OrderItem } from '@/types/order/order.types';

interface LocalDraftItem {
    food_id: number;
    food_name: string;
    category: string;
    price: number;
    qty: number;
    subtotal: number;
    isLocal: true;
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = Number(params.id);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<FoodCategory | 'all'>('all');
    const [localDrafts, setLocalDrafts] = useState<LocalDraftItem[]>([]);

    const { data, isLoading, isError, error, refetch } = useOrderDetail(orderId);
    const order = data?.data;
    
    const { data: foodsData, isLoading: isLoadingFoods } = useFoods({ is_available: true });
    const foods = foodsData?.data || [];


    const addItemMutation = useAddOrderItem(orderId);
    const sendDraftsMutation = useSendDraftItems(orderId);


    const filteredFoods = useMemo(() => {
        return foods.filter((food) => {
            const matchesCategory = activeCategory === 'all' || food.category === activeCategory;
            const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [foods, activeCategory, searchQuery]);

    const categories = [
        { label: 'All', value: 'all' as const },
        { label: 'Food', value: 'food' as FoodCategory },
        { label: 'Beverage', value: 'beverage' as FoodCategory },
        { label: 'Dessert', value: 'dessert' as FoodCategory },
    ];

    const handleAddItem = (foodId: number) => {
        const food = foods.find(f => f.id === foodId);
        if (!food) return;


        const existingIndex = localDrafts.findIndex(item => item.food_id === foodId);
        
        if (existingIndex >= 0) {
            // Jika sudah ada, tambah qty
            const updated = [...localDrafts];
            updated[existingIndex] = {
                ...updated[existingIndex],
                qty: updated[existingIndex].qty + 1,
                subtotal: (updated[existingIndex].qty + 1) * updated[existingIndex].price,
            };
            setLocalDrafts(updated);
        } else {

            const newDraft: LocalDraftItem = {
                food_id: food.id,
                food_name: food.name,
                category: food.category,
                price: Number(food.price),
                qty: 1,
                subtotal: Number(food.price),
                isLocal: true,
            };
            setLocalDrafts([...localDrafts, newDraft]);
        }
    };


    const handleUpdateLocalQty = (foodId: number, newQty: number) => {
        if (newQty < 1) return;
        
        const updated = localDrafts.map(item => {
            if (item.food_id === foodId) {
                return {
                    ...item,
                    qty: newQty,
                    subtotal: newQty * item.price,
                };
            }
            return item;
        });
        setLocalDrafts(updated);
    };


    const handleDeleteLocal = (foodId: number) => {
        setLocalDrafts(localDrafts.filter(item => item.food_id !== foodId));
    };


    const handleSendToKitchen = () => {
        if (localDrafts.length === 0) return;

        const items = localDrafts.map(item => ({
            food_id: item.food_id,
            qty: item.qty,
        }));

        addItemMutation.mutate(
            { items },
            {
                onSuccess: () => {

                    setLocalDrafts([]);

                    refetch();
                },
            }
        );
    };

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

    const allItems = order.items || [];
    const sentItems = allItems.filter(item => item.status === 'sent');
    
    const sentTotal = sentItems.reduce((sum, item) => sum + item.subtotal, 0);
    const localDraftTotal = localDrafts.reduce((sum, item) => sum + item.subtotal, 0);
    const grandTotal = sentTotal + localDraftTotal;
    
    const hasLocalDrafts = localDrafts.length > 0;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">
                            {order.table?.table_number || `Table ${order.table_id}`}
                        </h1>
                        <p className="text-xs text-gray-500">{order.order_number}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Menu Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Category Tabs */}
                        <CategoryTabs
                            categories={categories}
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                        />

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search menu items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Food Items List */}
                        <div className="space-y-3">
                            {isLoadingFoods ? (
                                <div className="text-center py-8 text-gray-500">Loading menu...</div>
                            ) : filteredFoods.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No menu items found
                                </div>
                            ) : (
                                filteredFoods.map((food) => (
                                    <MenuItemCard
                                        key={food.id}
                                        food={food}
                                        onAdd={handleAddItem}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right: Current Order */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-20">
                            <CardHeader>
                                <CardTitle>Current Order</CardTitle>
                                <p className="text-sm text-gray-500">
                                    {order.table?.table_number || `Table ${order.table_id}`} •{' '}
                                    {new Date(order.opened_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'numeric',
                                        year: 'numeric',
                                    })}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Sent Items (Already in Kitchen) */}
                                {sentItems.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold text-gray-700 uppercase">
                                            Sent to Kitchen
                                        </h3>
                                        <div className="space-y-2">
                                            {sentItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex justify-between text-sm py-2 border-b last:border-b-0"
                                                >
                                                    <div>
                                                        <p className="font-medium">{item.food_name}</p>
                                                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                                    </div>
                                                    <p className="font-semibold">
                                                        Rp {item.subtotal.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Local Draft Items (Editable, belum di-POST) */}
                                {localDrafts.length === 0 && sentItems.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8 text-sm">
                                        No items yet. Add items from the menu!
                                    </div>
                                ) : localDrafts.length > 0 ? (
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold text-orange-700 uppercase">
                                            Draft Items (Belum Dikirim)
                                        </h3>
                                        <div className="space-y-0 max-h-100 overflow-y-auto">
                                            {localDrafts.map((item) => (
                                                <LocalDraftCartItem
                                                    key={item.food_id}
                                                    item={item}
                                                    onUpdateQty={handleUpdateLocalQty}
                                                    onDelete={handleDeleteLocal}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                                {/* Summary */}
                                {(sentItems.length > 0 || localDrafts.length > 0) && (
                                    <div className="border-t pt-4 space-y-2">
                                        {sentItems.length > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Sent Total:</span>
                                                <span className="font-semibold">
                                                    Rp {sentTotal.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        )}
                                        {localDrafts.length > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Draft Total:</span>
                                                <span className="font-semibold text-orange-600">
                                                    Rp {localDraftTotal.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center pt-2 border-t">
                                            <span className="font-semibold text-lg">Grand Total</span>
                                            <span className="font-bold text-xl">
                                                Rp {grandTotal.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                {(sentItems.length > 0 || localDrafts.length > 0) && (
                                    <div className="space-y-2">
                                        {hasLocalDrafts && (
                                            <Button 
                                                className="w-full" 
                                                size="lg"
                                                onClick={handleSendToKitchen}
                                                disabled={addItemMutation.isPending}
                                            >
                                                {addItemMutation.isPending ? 'Sending...' : '🍴 Send to Kitchen'}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
