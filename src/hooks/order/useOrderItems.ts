import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchOrderDetail,
    addOrderItem,
    sendDraftItems,
    updateOrderItem,
    deleteOrderItem,
} from '@/services/order/order.service';
import {
    OrderDetailResponse,
    AddOrderItemInput,
    AddOrderItemResponse,
    SendDraftItemsResponse,
} from '@/types/order/order.types';
import { showSuccessToast, showErrorToast } from '@/lib/toast';


export const useOrderDetail = (orderId: number) => {
    return useQuery<OrderDetailResponse>({
        queryKey: ['order', orderId],
        queryFn: () => fetchOrderDetail(orderId),
        enabled: !!orderId,
    });
};


export const useAddOrderItem = (orderId: number) => {
    const queryClient = useQueryClient();

    return useMutation<AddOrderItemResponse, Error, AddOrderItemInput>({
        mutationFn: (input) => addOrderItem(orderId, input),
        onSuccess: (response) => {
            showSuccessToast(response);
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
        },
        onError: (error) => {
            showErrorToast(error);
        },
    });
};


export const useSendDraftItems = (orderId: number) => {
    const queryClient = useQueryClient();

    return useMutation<SendDraftItemsResponse, Error, void>({
        mutationFn: () => sendDraftItems(orderId),
        onSuccess: (response) => {
            showSuccessToast(response);
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
        },
        onError: (error) => {
            showErrorToast(error);
        },
    });
};


export const useUpdateOrderItem = (orderId: number) => {
    const queryClient = useQueryClient();

    return useMutation<AddOrderItemResponse, Error, { itemId: number; qty: number }>({
        mutationFn: ({ itemId, qty }) => updateOrderItem(orderId, itemId, qty),
        onSuccess: (response) => {
            showSuccessToast(response);
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
        },
        onError: (error) => {
            showErrorToast(error);
        },
    });
};


export const useDeleteOrderItem = (orderId: number) => {
    const queryClient = useQueryClient();

    return useMutation<{ status: string; message: string }, Error, number>({
        mutationFn: (itemId) => deleteOrderItem(orderId, itemId),
        onSuccess: (response) => {
            showSuccessToast(response.message);
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
        },
        onError: (error) => {
            showErrorToast(error);
        },
    });
};
