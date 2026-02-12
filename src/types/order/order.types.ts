
export type OrderStatus = 'open' | 'closed' | 'cancelled';


export type OrderItemStatus = 'draft' | 'sent';


export interface OrderItem {
    id: number;
    order_id: number;
    food_id: number;
    food_name: string;
    category: string;
    qty: number;
    price: number;
    subtotal: number;
    status: OrderItemStatus;
    sent_at: string | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}


export interface OrderTable {
    id: number;
    table_number: string;
    capacity: number;
    status: string;
}


export interface OrderSummary {
    draft_items: number;
    draft_total: number;
    total_amount: number;
}


export interface Order {
    id: number;
    table_id: number;
    user_id: number;
    order_number: string;
    status: OrderStatus;
    total_amount: number;
    opened_at: string;
    closed_at: string | null;
    table?: OrderTable;
    items?: OrderItem[];
    drafts?: OrderItem[];
    summary?: OrderSummary;
    created_at?: string;
    updated_at?: string;
}


export interface OpenOrderInput {
    table_id: number;
}


export interface OpenOrderResponse {
    status: string;
    message: string;
    data: Order;
}


export interface SingleItemInput {
    food_id: number;
    qty: number;
    notes?: string;
}


export interface AddOrderItemInput {

    food_id?: number;
    qty?: number;
    notes?: string;
    
 
    items?: SingleItemInput[];
    
 
    send_now?: boolean;
}


export interface AddOrderItemResponse {
    status: string;
    message: string;
    data: OrderItem | OrderItem[];
}

export interface SendDraftItemsResponse {
    status: string;
    message: string;
    data: OrderItem[];
}


export interface OrderDetailResponse {
    status: string;
    message: string;
    data: Order;
}


export interface OrdersResponse {
    status: string;
    data: Order[];
}
