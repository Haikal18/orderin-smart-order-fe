import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/services/order/order.service';
import { OrderListResponse } from '@/types/order/order.types';

export const useOrders = (status?: string, page?: number) => {
    return useQuery<OrderListResponse, Error>({
        queryKey: ['orders', status, page],
        queryFn: () => getOrders(status, page),
    });
};
