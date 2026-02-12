import { useQuery } from '@tanstack/react-query';
import { fetchTables } from '@/services/meja-tersedia/meja.service';
import { TablesResponse } from '@/types/meja-tersedia/meja.types';

export const useTables = (filters?: { search?: string }) => {
    return useQuery<TablesResponse>({
        queryKey: ['tables', filters ?? {}],
        queryFn: () => fetchTables(filters),
    });
};
