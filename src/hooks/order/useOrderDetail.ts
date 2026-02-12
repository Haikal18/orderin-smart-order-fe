import { useQuery } from '@tanstack/react-query';
import { getOrderDetail } from '@/services/order/order.service';
import { OrderDetail } from '@/types/order/order.types';

export const useOrderDetail = (id: number) => {
    return useQuery<OrderDetail, Error>({
        queryKey: ['orderDetail', id],
        queryFn: () => getOrderDetail(id),
        enabled: Boolean(id),
    });
};
