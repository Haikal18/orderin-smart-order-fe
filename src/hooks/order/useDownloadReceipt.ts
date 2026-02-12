import { useMutation } from '@tanstack/react-query';
import { downloadOrderReceipt } from '@/services/order/order.service';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

export const useDownloadReceipt = () => {
    return useMutation<Blob, Error, number>({
        mutationFn: downloadOrderReceipt,
        onSuccess: (blob, orderId) => {

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `receipt-${orderId}.pdf`;


            document.body.appendChild(link);
            link.click();

 
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showSuccessToast('Receipt berhasil diunduh');
        },
        onError: (error) => {
            showErrorToast(error);
        },
    });
};
