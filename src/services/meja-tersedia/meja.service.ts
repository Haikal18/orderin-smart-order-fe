import api from '@/lib/api';
import { TablesResponse } from '@/types/meja-tersedia/meja.types';

export const fetchTables = async (): Promise<TablesResponse> => {
    const response = await api.get('/tables');
    return response.data;
};
