'use client';

import { Button } from '@/components/ui/button';
import { FileText, CheckCircle } from 'lucide-react';
import { useDownloadReceipt } from '@/hooks/order/useDownloadReceipt';
import { useCloseOrderDetail } from '@/hooks/order/useCloseOrderDetail';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleDownloadReceipt}
                    disabled={downloadMutation.isPending}
                >
                    <FileText className="w-4 h-4 mr-2" />
                    {downloadMutation.isPending ? 'Mengunduh...' : 'Generate Receipt'}
                </Button>
                <Button
                    className="flex-1"
                    onClick={handleOpenConfirm}
                    disabled={closeMutation.isPending || (parseFloat(customerPayment || '0') < totalAmount)}
                >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {closeMutation.isPending ? 'Menutup...' : 'Close Order'}
                </Button>
            </div>

            {/* Confirmation dialog */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Tutup Order</DialogTitle>
                        <DialogDescription>Anda akan menutup order ini.</DialogDescription>
                        <div className="mt-2 text-sm text-zinc-600">
                            Total: <strong>Rp{totalAmount.toLocaleString()}</strong>
                            <br />
                            Pembayaran pelanggan: <strong>Rp{(parseFloat(customerPayment || '0')).toLocaleString()}</strong>
                        </div>
                    </DialogHeader>

                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={closeMutation.isPending}>Batal</Button>
                        <Button variant="destructive" onClick={handleConfirmClose} disabled={closeMutation.isPending}>
                            {closeMutation.isPending ? 'Menutup...' : 'Tutup Order'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
