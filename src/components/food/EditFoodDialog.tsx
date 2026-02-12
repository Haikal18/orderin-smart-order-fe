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
import { useUpdateFood } from '@/hooks/food/useFoods';
import { Food } from '@/types/food/food.types';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

interface EditFoodDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    food: Food | null;
}

export default function EditFoodDialog({ open, onOpenChange, food }: EditFoodDialogProps) {
    const updateMutation = useUpdateFood();

    const handleSubmit = async (data: FoodFormValues) => {
        if (!food) return;

        try {
            await updateMutation.mutateAsync({
                id: food.id,
                input: {
                    name: data.name,
                    price: data.price,
                    category: data.category,
                    is_available: data.is_available,
                    description: data.description,
                    image: data.image,
                },
            });
            
            onOpenChange(false);
            showSuccessToast('Makanan berhasil diupdate');
        } catch (error) {
            showErrorToast(error);
        }
    };

    if (!food) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Makanan</DialogTitle>
                </DialogHeader>
                <FoodForm
                    onSubmit={handleSubmit}
                    defaultValues={food}
                    isLoading={updateMutation.isPending}
                />
            </DialogContent>
        </Dialog>
    );
}
