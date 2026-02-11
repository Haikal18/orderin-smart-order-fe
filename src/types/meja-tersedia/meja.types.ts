export type TableStatus = 'available' | 'occupied' | 'reserved' | 'inactive';

export interface Table {
    id: number;
    table_number: string;
    status: TableStatus;
}

export interface TablesResponse {
    success: boolean;
    message: string;
    data: Table[];
}
