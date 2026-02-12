'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import FoodForm from './FoodForm';
import { FoodFormValues } from '@/schema/food/food.schema';
import { useCreateFood } from '@/hooks/food/useFoods';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

interface CreateFoodDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateFoodDialog({ open, onOpenChange }: CreateFoodDialogProps) {
    const createMutation = useCreateFood();

    const handleSubmit = async (data: FoodFormValues) => {
        try {
            await createMutation.mutateAsync({
                name: data.name,
                price: data.price,
                category: data.category,
                is_available: data.is_available,
                description: data.description,
                image: data.image,
            });
            
            onOpenChange(false);
            console.log('Makanan berhasil ditambahkan');
        } catch (error) {
            console.error('Error creating food:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Makanan Baru</DialogTitle>
                </DialogHeader>
                <FoodForm
                    onSubmit={handleSubmit}
                    isLoading={createMutation.isPending}
                />
            </DialogContent>
        </Dialog>
    );
}
