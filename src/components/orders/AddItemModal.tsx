'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useFoods } from '@/hooks/food/useFoods';
import { useAddOrderItem } from '@/hooks/order/useOrderItems';

interface AddItemModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderId: number;
}

export default function AddItemModal({ open, onOpenChange, orderId }: AddItemModalProps) {
    const [selectedFoodId, setSelectedFoodId] = useState<string>('');
    const [qty, setQty] = useState<number>(1);


    const { data: foodsData, isLoading: isLoadingFoods } = useFoods({ is_available: true });
    const foods = foodsData?.data || [];


    const addItemMutation = useAddOrderItem(orderId);


    useEffect(() => {
        if (!open) {
            setSelectedFoodId('');
            setQty(1);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFoodId || qty < 1) {
            return;
        }

        try {
            await addItemMutation.mutateAsync({
                food_id: parseInt(selectedFoodId),
                qty,
            });


            onOpenChange(false);
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    };

    const selectedFood = foods.find((f) => f.id === parseInt(selectedFoodId));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Tambah Item ke Order</DialogTitle>
                    <DialogDescription>
                        Pilih makanan dan masukkan jumlah yang ingin ditambahkan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Food Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="food">Pilih Makanan *</Label>
                        <Select
                            value={selectedFoodId}
                            onValueChange={setSelectedFoodId}
                            disabled={isLoadingFoods}
                        >
                            <SelectTrigger id="food">
                                <SelectValue placeholder="Pilih makanan..." />
                            </SelectTrigger>
                            <SelectContent>
                                {foods.map((food) => (
                                    <SelectItem key={food.id} value={food.id.toString()}>
                                        <div className="flex items-center justify-between w-full">
                                            <span>{food.name}</span>
                                            <span className="text-sm text-gray-500 ml-4">
                                                Rp {parseFloat(food.price).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Quantity Input */}
                    <div className="space-y-2">
                        <Label htmlFor="qty">Jumlah *</Label>
                        <Input
                            id="qty"
                            type="number"
                            min="1"
                            value={qty}
                            onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                            placeholder="Masukkan jumlah"
                        />
                    </div>

                    {/* Price Preview */}
                    {selectedFood && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Harga Satuan:</span>
                                <span className="font-medium">
                                    Rp {parseFloat(selectedFood.price).toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Jumlah:</span>
                                <span className="font-medium">{qty}</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between">
                                <span className="font-semibold">Subtotal:</span>
                                <span className="font-semibold text-lg">
                                    Rp {(parseFloat(selectedFood.price) * qty).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1"
                            disabled={addItemMutation.isPending}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={!selectedFoodId || qty < 1 || addItemMutation.isPending}
                        >
                            {addItemMutation.isPending ? 'Menambahkan...' : 'Tambah ke Order'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
