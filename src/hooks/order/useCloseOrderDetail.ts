import { useMutation, useQueryClient } from '@tanstack/react-query';
import { closeOrderDetail } from '@/services/order/order.service';
import { CloseOrderResponse } from '@/types/order/order.types';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { useDownloadReceipt } from '@/hooks/order/useDownloadReceipt';

export const useCloseOrderDetail = () => {
    const queryClient = useQueryClient();
    const downloadMutation = useDownloadReceipt();

    return useMutation<CloseOrderResponse, Error, { id: number; cash: number }>({
        mutationFn: (payload) => closeOrderDetail(payload),
        onSuccess: (response) => {
            showSuccessToast(response);


            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['orderDetail', response.data.id] });
            queryClient.invalidateQueries({ queryKey: ['tables'] });

            try {
                downloadMutation.mutate(response.data.id);
            } catch {
            }
        },
        onError: (error) => {
            showErrorToast(error);
        },
    });
};
