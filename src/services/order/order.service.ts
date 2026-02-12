import api from '@/lib/api';
import {
    OpenOrderInput,
    OpenOrderResponse,
    AddOrderItemInput,
    AddOrderItemResponse,
    SendDraftItemsResponse,
    OrderCurrentResponse,
    OrdersResponse,
    OrderListResponse,
    OrderDetail,
    CloseOrderResponse,
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


export const fetchOrderDetail = async (orderId: number): Promise<OrderCurrentResponse> => {
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
): Promise<OrderCurrentResponse> => {
    const response = await api.post(`/orders/${orderId}/close`);
    return response.data;
};

// Order Management Services (untuk si kasir)
export const getOrders = async (status?: string, page?: number): Promise<OrderListResponse> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (page) params.append('page', page.toString());
    
    const response = await api.get(`/orders?${params.toString()}`);
    return response.data;
};

export const getOrderDetail = async (id: number): Promise<OrderDetail> => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
};

export const closeOrderDetail = async (payload: { id: number; cash: number }): Promise<CloseOrderResponse> => {
    const { id, cash } = payload;
    const response = await api.post(`/orders/${id}/close`, { cash });
    return response.data;
};

export const downloadOrderReceipt = async (id: number): Promise<Blob> => {
    const response = await api.get(`/orders/${id}/receipt`, {
        responseType: 'blob'
    });
    return response.data;
};
