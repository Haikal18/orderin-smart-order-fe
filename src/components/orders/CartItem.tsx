'use client';

import { OrderItem } from '@/types/order/order.types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
    item: OrderItem;
    onUpdateQty: (itemId: number, newQty: number) => void;
    onDelete: (itemId: number) => void;
    isUpdating?: boolean;
    isDeleting?: boolean;
}

export default function CartItem({
    item,
    onUpdateQty,
    onDelete,
    isUpdating,
    isDeleting,
}: CartItemProps) {
    const handleDecrease = () => {
        if (item.qty > 1) {
            onUpdateQty(item.id, item.qty - 1);
        }
    };

    const handleIncrease = () => {
        onUpdateQty(item.id, item.qty + 1);
    };

    return (
        <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight mb-2">{item.food_name}</h4>
                <div className="flex items-center gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={handleDecrease}
                        disabled={isUpdating || isDeleting || item.qty <= 1}
                        className="h-7 w-7 rounded"
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{item.qty}</span>
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={handleIncrease}
                        disabled={isUpdating || isDeleting}
                        className="h-7 w-7 rounded"
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(item.id)}
                        disabled={isUpdating || isDeleting}
                        className="h-7 w-7 rounded ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>
            <div className="text-right shrink-0">
                <p className="text-sm font-semibold">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                </p>
            </div>
        </div>
    );
}
