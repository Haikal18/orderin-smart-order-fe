'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PaymentCardProps {
    totalAmount: number;
    customerPayment: string;
    onCustomerPaymentChange: (value: string) => void;
}

export const PaymentCard = ({ totalAmount, customerPayment, onCustomerPaymentChange }: PaymentCardProps) => {
    const change = useMemo(() => {
        const payment = parseFloat(customerPayment) || 0;
        const calculatedChange = payment - totalAmount;
        return calculatedChange >= 0 ? calculatedChange : 0;
    }, [customerPayment, totalAmount]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        onCustomerPaymentChange(value);
    };

    return (
        <Card className="sticky top-4">
            <CardHeader>
                <CardTitle>Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Total:</span>
                        <span className="text-xl font-bold text-slate-900">
                            {formatCurrency(totalAmount)}
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="payment">Uang Pelanggan</Label>
                    <Input
                        id="payment"
                        type="text"
                        placeholder="Masukkan jumlah uang"
                        value={customerPayment}
                        onChange={handlePaymentChange}
                        className="text-lg"
                    />
                </div>

                <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Kembalian:</span>
                        <span className={`text-xl font-bold ${change > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                            {formatCurrency(change)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
