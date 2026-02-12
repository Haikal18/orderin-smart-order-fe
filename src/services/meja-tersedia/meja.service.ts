import api from '@/lib/api';
import { TablesResponse } from '@/types/meja-tersedia/meja.types';

export const fetchTables = async (filters?: { search?: string }): Promise<TablesResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`/tables${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
};
