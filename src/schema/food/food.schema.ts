import { z } from 'zod';

const MAX_FILE_SIZE = 2048 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const foodFormSchema = z.object({
    name: z.string().min(1, 'Nama makanan wajib diisi'),
    price: z
        .number()
        .positive('Harga harus lebih dari 0'),
    category: z.enum(['food', 'beverage', 'dessert'] as const),
    is_available: z.boolean(),
    description: z.string().optional(),
    image: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= MAX_FILE_SIZE,
            'Ukuran file maksimal 2MB'
        )
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
            'Format file harus JPG, JPEG, PNG, atau WEBP'
        ),
});

export type FoodFormValues = z.infer<typeof foodFormSchema>;
