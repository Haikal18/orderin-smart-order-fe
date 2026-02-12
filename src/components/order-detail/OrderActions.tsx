'use client';

import { Button } from '@/components/ui/button';
import { FileText, CheckCircle } from 'lucide-react';
import { useDownloadReceipt } from '@/hooks/order/useDownloadReceipt';
import { useCloseOrderDetail } from '@/hooks/order/useCloseOrderDetail';
import { useState } from 'react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

import { showErrorToast } from '@/lib/toast';

interface OrderActionsProps {
    orderId: number;
    customerPayment: string;
    totalAmount: number;
}

export const OrderActions = ({ orderId, customerPayment, totalAmount }: OrderActionsProps) => {
    const downloadMutation = useDownloadReceipt();
    const closeMutation = useCloseOrderDetail();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleDownloadReceipt = () => {
        downloadMutation.mutate(orderId);
    };

    const handleOpenConfirm = () => {
        const payment = parseFloat(customerPayment) || 0;
        if (payment < totalAmount) {
            showErrorToast('Uang pelanggan tidak mencukupi');
            return;
        }

        setConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        const payment = parseFloat(customerPayment) || 0;
        closeMutation.mutate({ id: orderId, cash: payment });
        setConfirmOpen(false);
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    variant="outline"
                    className="w-full sm:flex-1"
                    onClick={handleDownloadReceipt}
                    disabled={downloadMutation.isPending}
                >
                    <FileText className="w-4 h-4 mr-2" />
                    {downloadMutation.isPending ? 'Mengunduh...' : 'Generate Receipt'}
                </Button>
                <Button
                    className="w-full sm:flex-1"
                    onClick={handleOpenConfirm}
                    disabled={closeMutation.isPending || (parseFloat(customerPayment || '0') < totalAmount)}
                >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {closeMutation.isPending ? 'Menutup...' : 'Close Order'}
                </Button>
            </div>

            {/* Confirmation dialog (reusable) */}
            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Konfirmasi Tutup Order"
                description={
                    <>
                        Anda akan menutup order ini.
                        <div className="mt-2 text-sm text-zinc-600">
                            Total: <strong>Rp{totalAmount.toLocaleString()}</strong>
                            <br />
                            Pembayaran pelanggan: <strong>Rp{(parseFloat(customerPayment || '0')).toLocaleString()}</strong>
                        </div>
                    </>
                }
                confirmLabel="Tutup Order"
                cancelLabel="Batal"
                onConfirm={handleConfirmClose}
                isLoading={closeMutation.isPending}
                destructive
            />
        </>
    );
};
