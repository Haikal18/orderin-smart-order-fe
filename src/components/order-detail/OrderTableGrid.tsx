import { OrderListItem } from '@/types/order/order.types';
import { cn } from '@/lib/utils';

interface OrderTableGridProps {
    orders: OrderListItem[];
    onOrderClick?: (order: OrderListItem) => void;
}

export const OrderTableGrid = ({ orders, onOrderClick }: OrderTableGridProps) => {
    const handleClick = (order: OrderListItem) => {
        if (onOrderClick) {
            onOrderClick(order);
        }
    };

    return (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {orders.map((order) => (
                <button
                    key={order.id}
                    onClick={() => handleClick(order)}
                    className={cn(
                        'aspect-square rounded-xl flex items-center justify-center text-white font-semibold text-base transition-all hover:scale-105',
                        'bg-slate-500 hover:bg-slate-600'
                    )}
                >
                    {order.table_number}
                </button>
            ))}
        </div>
    );
};
