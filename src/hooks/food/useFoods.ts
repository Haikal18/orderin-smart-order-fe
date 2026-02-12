import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchFoods,
    createFood,
    updateFood,
    deleteFood,
} from '@/services/food/food.service';
import {
    FoodsResponse,
    UpdateFoodInput,
    FoodFilters,
    Food,
} from '@/types/food/food.types';


export const useFoods = (filters?: FoodFilters) => {
    return useQuery<FoodsResponse>({
        queryKey: ['foods', filters],
        queryFn: () => fetchFoods(filters),
        staleTime: 60_000,
    });
};


export const useCreateFood = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createFood,
        onMutate: async (newFood) => {
         
            await queryClient.cancelQueries({ queryKey: ['foods'] });

          
            const previousFoods = queryClient.getQueryData<FoodsResponse>(['foods']);

   
            if (previousFoods) {
                const optimisticFood: Food = {
                    id: Date.now(), 
                    name: newFood.name,
                    category: newFood.category,
                    price: newFood.price.toString(),
                    is_available: newFood.is_available ?? true,
                    description: newFood.description ?? null,
                    image_url: newFood.image ? URL.createObjectURL(newFood.image) : null,
                    image_id: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                queryClient.setQueryData<FoodsResponse>(['foods'], {
                    ...previousFoods,
                    data: [...previousFoods.data, optimisticFood],
                });
            }

            return { previousFoods };
        },
        onError: (err, newFood, context) => {

            if (context?.previousFoods) {
                queryClient.setQueryData(['foods'], context.previousFoods);
            }
        },
        onSettled: () => {
        
            queryClient.invalidateQueries({ queryKey: ['foods'] });
        },
    });
};


export const useUpdateFood = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: number; input: UpdateFoodInput }) =>
            updateFood(id, input),
        onMutate: async ({ id, input }) => {
           
            await queryClient.cancelQueries({ queryKey: ['foods'] });


            const previousFoods = queryClient.getQueryData<FoodsResponse>(['foods']);


            if (previousFoods) {
                queryClient.setQueryData<FoodsResponse>(['foods'], {
                    ...previousFoods,
                    data: previousFoods.data.map((food) =>
                        food.id === id
                            ? {
                                  ...food,
                                  ...(input.name && { name: input.name }),
                                  ...(input.price !== undefined && { price: input.price.toString() }),
                                  ...(input.category && { category: input.category }),
                                  ...(input.is_available !== undefined && {
                                      is_available: input.is_available,
                                  }),
                                  ...(input.description !== undefined && {
                                      description: input.description,
                                  }),
                                  ...(input.image && {
                                      image_url: URL.createObjectURL(input.image),
                                  }),
                                  updated_at: new Date().toISOString(),
                              }
                            : food
                    ),
                });
            }

            return { previousFoods };
        },
        onError: (err, variables, context) => {

            if (context?.previousFoods) {
                queryClient.setQueryData(['foods'], context.previousFoods);
            }
        },
        onSettled: () => {

            queryClient.invalidateQueries({ queryKey: ['foods'] });
        },
    });
};

export const useDeleteFood = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFood,
        onMutate: async (id) => {
       
            await queryClient.cancelQueries({ queryKey: ['foods'] });

    
            const previousFoods = queryClient.getQueryData<FoodsResponse>(['foods']);

         
            if (previousFoods) {
                queryClient.setQueryData<FoodsResponse>(['foods'], {
                    ...previousFoods,
                    data: previousFoods.data.filter((food) => food.id !== id),
                });
            }

            return { previousFoods };
        },
        onError: (err, id, context) => {

            if (context?.previousFoods) {
                queryClient.setQueryData(['foods'], context.previousFoods);
            }
        },
        onSettled: () => {

            queryClient.invalidateQueries({ queryKey: ['foods'] });
        },
    });
};
