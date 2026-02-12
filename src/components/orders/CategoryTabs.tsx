'use client';

import { FoodCategory } from '@/types/food/food.types';
import { Button } from '@/components/ui/button';

interface CategoryTabsProps {
    categories: Array<{ label: string; value: FoodCategory | 'all' }>;
    activeCategory: FoodCategory | 'all';
    onCategoryChange: (category: FoodCategory | 'all') => void;
}

export default function CategoryTabs({
    categories,
    activeCategory,
    onCategoryChange,
}: CategoryTabsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
                <Button
                    key={category.value}
                    variant={activeCategory === category.value ? 'default' : 'outline'}
                    onClick={() => onCategoryChange(category.value)}
                    className="whitespace-nowrap"
                >
                    {category.label}
                </Button>
            ))}
        </div>
    );
}
