import { useQuery } from '@tanstack/react-query';
import { fetchTables } from '@/services/meja-tersedia/meja.service';
import { TablesResponse } from '@/types/meja-tersedia/meja.types';

export const useTables = () => {
    return useQuery<TablesResponse>({
        queryKey: ['tables'],
        queryFn: fetchTables,
    });
};
