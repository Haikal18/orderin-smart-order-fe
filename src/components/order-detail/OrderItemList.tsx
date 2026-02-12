import { OrderDetailItem } from '@/types/order/order.types';
import Image from 'next/image';

interface OrderItemListProps {
    items: OrderDetailItem[];
}

export const OrderItemList = ({ items }: OrderItemListProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-white"
                >
                    {item.image_url ? (
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                                src={item.image_url}
                                alt={item.food_name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-16 h-16 flex-shrink-0 rounded-md bg-slate-200 flex items-center justify-center">
                            <span className="text-slate-400 text-xs">No Image</span>
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900">{item.food_name}</h4>
                        <p className="text-sm text-slate-500">{item.category}</p>
                        {item.notes && (
                            <p className="text-xs text-slate-600 mt-1 italic">
                                Note: {item.notes}
                            </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-slate-600">
                                {item.quantity} × {formatCurrency(parseFloat(String(item.price)))}
                            </span>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="font-semibold text-slate-900">
                            {formatCurrency(parseFloat(String(item.subtotal)))}
                        </div>
                        <div className="mt-1">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                                {item.status === 'sent' ? 'Terkirim' : 'Draft'}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
