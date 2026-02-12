'use client';

import { Food } from '@/types/food/food.types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Image from 'next/image';

interface MenuItemCardProps {
    food: Food;
    onAdd: (foodId: number) => void;
    isLoading?: boolean;
}

export default function MenuItemCard({ food, onAdd, isLoading }: MenuItemCardProps) {
    return (
        <div className="flex items-start gap-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
            {/* Food Image */}
            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {food.image_url ? (
                    <Image
                        src={food.image_url}
                        alt={food.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                        🍽️
                    </div>
                )}
            </div>

            {/* Food Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base mb-1 truncate">{food.name}</h3>
                {food.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {food.description}
                    </p>
                )}
                <p className="text-base font-bold text-gray-900">
                    Rp {Number(food.price).toLocaleString('id-ID')}
                </p>
            </div>

            {/* Add Button */}
            <Button
                size="icon"
                onClick={() => onAdd(food.id)}
                disabled={!food.is_available}
                className="rounded-lg h-10 w-10 shrink-0"
            >
                <Plus className="h-5 w-5" />
            </Button>
        </div>
    );
}
