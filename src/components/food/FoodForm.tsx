'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { foodFormSchema, FoodFormValues } from '@/schema/food/food.schema';
import { FoodCategory } from '@/types/food/food.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Food } from '@/types/food/food.types';

interface FoodFormProps {
    onSubmit: (data: FoodFormValues) => void;
    defaultValues?: Partial<Food>;
    isLoading?: boolean;
}

export default function FoodForm({ onSubmit, defaultValues, isLoading }: FoodFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(
        defaultValues?.image_url || null
    );

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm<FoodFormValues>({
        resolver: zodResolver(foodFormSchema),
        defaultValues: {
            name: defaultValues?.name || '',
            price: defaultValues?.price ? parseFloat(defaultValues.price) : undefined,
            category: defaultValues?.category || undefined,
            is_available: defaultValues?.is_available ?? true,
            description: defaultValues?.description || '',
        },
    });

    const isAvailable = watch('is_available') ?? true;
    const imageFile = watch('image');

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImagePreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nama Makanan *</Label>
                <Input
                    id="name"
                    placeholder="Contoh: Nasi Goreng"
                    {...register('name')}
                />
                {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="price">Harga *</Label>
                <Input
                    id="price"
                    type="number"
                    placeholder="25000"
                    {...register('price', { valueAsNumber: true })}
                />
                {errors.price && (
                    <p className="text-sm text-red-600">{errors.price.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value as FoodCategory)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="food">Makanan</SelectItem>
                                <SelectItem value="beverage">Minuman</SelectItem>
                                <SelectItem value="dessert">Dessert</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.category && (
                    <p className="text-sm text-red-600">{errors.category.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <textarea
                    id="description"
                    placeholder="Deskripsi makanan (opsional)"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-md min-h-20 text-sm"
                    {...register('description')}
                />
                {errors.description && (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Gambar</Label>
                <Input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        setValue('image', file);
                    }}
                />
                {errors.image && (
                    <p className="text-sm text-red-600">{errors.image.message}</p>
                )}
                {imagePreview && (
                    <div className="mt-2">
                        <div className="relative w-32 h-32">
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                className="object-cover rounded"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="is_available"
                    checked={isAvailable}
                    onCheckedChange={(checked) => setValue('is_available', checked)}
                />
                <Label htmlFor="is_available">Tersedia</Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
        </form>
    );
}
