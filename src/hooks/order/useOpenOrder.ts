import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { openOrder } from '@/services/order/order.service';
import { OpenOrderInput, OpenOrderResponse } from '@/types/order/order.types';
import { showSuccessToast, showErrorToast } from '@/lib/toast';


export const useOpenOrder = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation<OpenOrderResponse, Error, OpenOrderInput>({
        mutationFn: openOrder,
        onSuccess: (response) => {

            showSuccessToast(response);


            queryClient.invalidateQueries({ queryKey: ['tables'] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });


            router.push(`/orders/${response.data.id}`);
        },
        onError: (error) => {

            showErrorToast(error);
        },
    });
};
