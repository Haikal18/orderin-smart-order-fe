export type FoodCategory = 'food' | 'beverage' | 'dessert';

export interface Food {
    id: number;
    name: string;
    category: FoodCategory;
    price: string;
    is_available: boolean;
    description: string | null;
    image_url: string | null;
    image_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface FoodsResponse {
    status: string;
    data: Food[];
}

export interface FoodResponse {
    status: string;
    message: string;
    data: Food;
}

export interface CreateFoodInput {
    name: string;
    price: number;
    category: FoodCategory;
    is_available?: boolean;
    description?: string;
    image?: File;
}

export interface UpdateFoodInput {
    name?: string;
    price?: number;
    category?: FoodCategory;
    is_available?: boolean;
    description?: string;
    image?: File;
}

export interface FoodFilters {
    category?: FoodCategory;
    is_available?: boolean;
    search?: string;
}
