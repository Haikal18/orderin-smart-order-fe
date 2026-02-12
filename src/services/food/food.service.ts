import api from '@/lib/api';
import {
    FoodsResponse,
    FoodResponse,
    CreateFoodInput,
    UpdateFoodInput,
    FoodFilters,
} from '@/types/food/food.types';

export const fetchFoods = async (filters?: FoodFilters): Promise<FoodsResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.category) {
        params.append('category', filters.category);
    }
    if (filters?.is_available !== undefined) {
        params.append('is_available', filters.is_available ? '1' : '0');
    }
    if (filters?.search) {
        params.append('search', filters.search);
    }
    if (filters?.per_page !== undefined) {
        params.append('per_page', String(filters.per_page));
    }
    if (filters?.page !== undefined) {
        params.append('page', String(filters.page));
    }

    const response = await api.get(`/foods${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
};

export const createFood = async (input: CreateFoodInput): Promise<FoodResponse> => {
    const formData = new FormData();
    
    formData.append('name', input.name);
    formData.append('price', input.price.toString());
    formData.append('category', input.category);
    
    if (input.is_available !== undefined) {
        formData.append('is_available', input.is_available ? '1' : '0');
    }
    
    if (input.description) {
        formData.append('description', input.description);
    }
    
    if (input.image) {
        formData.append('image', input.image);
    }

    const response = await api.post('/foods', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    
    return response.data;
};


export const updateFood = async (id: number, input: UpdateFoodInput): Promise<FoodResponse> => {
    const formData = new FormData();
    
    if (input.name) {
        formData.append('name', input.name);
    }
    if (input.price !== undefined) {
        formData.append('price', input.price.toString());
    }
    if (input.category) {
        formData.append('category', input.category);
    }
    if (input.is_available !== undefined) {
        formData.append('is_available', input.is_available ? '1' : '0');
    }
    if (input.description !== undefined) {
        formData.append('description', input.description);
    }
    if (input.image) {
        formData.append('image', input.image);
    }


    formData.append('_method', 'PUT');

    const response = await api.post(`/foods/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    
    return response.data;
};


export const deleteFood = async (id: number): Promise<FoodResponse> => {
    const response = await api.delete(`/foods/${id}`);
    return response.data;
};
