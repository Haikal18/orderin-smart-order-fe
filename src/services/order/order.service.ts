import api from '@/lib/api';
import {
    OpenOrderInput,
    OpenOrderResponse,
    AddOrderItemInput,
    AddOrderItemResponse,
    SendDraftItemsResponse,
    OrderDetailResponse,
    OrdersResponse,
} from '@/types/order/order.types';

export const openOrder = async (input: OpenOrderInput): Promise<OpenOrderResponse> => {
    const response = await api.post('/orders/open', input);
    return response.data;
};


export const addOrderItem = async (
    orderId: number,
    input: AddOrderItemInput
): Promise<AddOrderItemResponse> => {
    const response = await api.post(`/orders/${orderId}/items`, input);
    return response.data;
};


export const sendDraftItems = async (orderId: number): Promise<SendDraftItemsResponse> => {
    const response = await api.post(`/orders/${orderId}/items/send`);
    return response.data;
};


export const fetchOrderDetail = async (orderId: number): Promise<OrderDetailResponse> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
};


export const fetchOrders = async (): Promise<OrdersResponse> => {
    const response = await api.get('/orders');
    return response.data;
};


export const updateOrderItem = async (
    orderId: number,
    itemId: number,
    qty: number
): Promise<AddOrderItemResponse> => {
    const response = await api.put(`/orders/${orderId}/items/${itemId}`, { qty });
    return response.data;
};


export const deleteOrderItem = async (
    orderId: number,
    itemId: number
): Promise<{ status: string; message: string }> => {
    const response = await api.delete(`/orders/${orderId}/items/${itemId}`);
    return response.data;
};


export const closeOrder = async (
    orderId: number
): Promise<OrderDetailResponse> => {
    const response = await api.post(`/orders/${orderId}/close`);
    return response.data;
};
