import { z } from 'zod';

export const bookSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required'),
        author: z.string().min(1, 'Author is required'),
        isbn: z.string().min(10, 'ISBN must be at least 10 characters'),
        publishedYear: z.number().int().min(1800).max(new Date().getFullYear()),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        genre: z.array(z.string().min(1)).nonempty('At least one genre is required'),
    }),
});

export type BookInput = z.infer<typeof bookSchema>;