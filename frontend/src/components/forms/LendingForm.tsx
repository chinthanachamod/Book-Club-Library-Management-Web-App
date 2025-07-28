import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

interface Book {
    id: string;
    title: string;
    author: string;
    availableCopies: number;
}

interface Reader {
    id: string;
    name: string;
    email: string;
}

const lendingSchema = z.object({
    bookId: z.string().min(1, 'Book is required'),
    readerId: z.string().min(1, 'Reader is required'),
});

type LendingFormData = z.infer<typeof lendingSchema>;

interface LendingFormProps {
    onSuccess: () => void;
}

export default function LendingForm({ onSuccess }: LendingFormProps) {
    const [searchBook, setSearchBook] = useState('');
    const [searchReader, setSearchReader] = useState('');

    const { data: books } = useQuery({
        queryKey: ['books', searchBook],
        queryFn: async () => {
            const response = await api.get(`/books?search=${searchBook}`);
            return response.data as Book[];
        }
    });

    const { data: readers } = useQuery({
        queryKey: ['readers', searchReader],
        queryFn: async () => {
            const response = await api.get(`/readers?search=${searchReader}`);
            return response.data as Reader[];
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LendingFormData>({
        resolver: zodResolver(lendingSchema),
    });

    const onSubmit = async (data: LendingFormData) => {
        try {
            await api.post('/lendings', data);
            toast.success('Book lent successfully');
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || 'Failed to lend book');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="bookId" className="block text-sm font-medium text-gray-700">
                    Book
                </label>
                <input
                    type="text"
                    placeholder="Search books..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={searchBook}
                    onChange={(e) => setSearchBook(e.target.value)}
                />
                <select
                    id="bookId"
                    {...register('bookId')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Select a book</option>
                    {books?.map((book) => (
                        <option key={book.id} value={book.id}>
                            {book.title} by {book.author} (Available: {book.availableCopies})
                        </option>
                    ))}
                </select>
                {errors.bookId && <p className="mt-1 text-sm text-red-600">{errors.bookId.message}</p>}
            </div>

            <div>
                <label htmlFor="readerId" className="block text-sm font-medium text-gray-700">
                    Reader
                </label>
                <input
                    type="text"
                    placeholder="Search readers..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={searchReader}
                    onChange={(e) => setSearchReader(e.target.value)}
                />
                <select
                    id="readerId"
                    {...register('readerId')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Select a reader</option>
                    {readers?.map((reader) => (
                        <option key={reader.id} value={reader.id}>
                            {reader.name} ({reader.email})
                        </option>
                    ))}
                </select>
                {errors.readerId && <p className="mt-1 text-sm text-red-600">{errors.readerId.message}</p>}
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onSuccess}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isSubmitting ? 'Processing...' : 'Lend Book'}
                </button>
            </div>
        </form>
    );
}