import { OrderListItem } from '@/types/order/order.types';

interface OrderTableListProps {
    orders: OrderListItem[];
    onOrderClick?: (order: OrderListItem) => void;
}

export const OrderTableList = ({ orders, onOrderClick }: OrderTableListProps) => {
    const handleClick = (order: OrderListItem) => {
        if (onOrderClick) {
            onOrderClick(order);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-2">
            {orders.map((order) => (
                <div
                    key={order.id}
                    onClick={() => handleClick(order)}
                    className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="font-semibold text-lg text-slate-900">
                            Meja {order.table_number}
                        </div>
                        <div className="text-sm text-slate-500">
                            {formatTime(order.opened_at)}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="font-semibold text-slate-900">
                            {formatCurrency(order.total_price)}
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                            Open
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
