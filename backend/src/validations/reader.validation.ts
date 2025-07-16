import { z } from 'zod';

export const readerSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
        phone: z.string().min(10, 'Phone number must be at least 10 digits'),
        address: z.string().min(1, 'Address is required'),
        isActive: z.boolean().optional(),
    }),
});

export type ReaderInput = z.infer<typeof readerSchema>;