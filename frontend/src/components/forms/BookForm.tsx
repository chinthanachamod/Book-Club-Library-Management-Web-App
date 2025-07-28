import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const bookSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    author: z.string().min(1, 'Author is required'),
    isbn: z.string().min(1, 'ISBN is required'),
    publisher: z.string().min(1, 'Publisher is required'),
    publicationYear: z.number().min(1000).max(new Date().getFullYear()),
    genre: z.string().min(1, 'Genre is required'),
    description: z.string().min(1, 'Description is required'),
    coverImage: z.string().optional(),
    totalCopies: z.number().min(1, 'Must have at least 1 copy'),
    availableCopies: z.number().min(0),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
    book?: any;
    onSuccess: () => void;
}

export default function BookForm({ book, onSuccess }: BookFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<BookFormData>({
        resolver: zodResolver(bookSchema),
        defaultValues: book || {
            title: '',
            author: '',
            isbn: '',
            publisher: '',
            publicationYear: new Date().getFullYear(),
            genre: '',
            description: '',
            coverImage: '',
            totalCopies: 1,
            availableCopies: 1,
        },
    });

    const onSubmit = async (data: BookFormData) => {
        try {
            if (book) {
                await api.put(`/books/${book.id}`, data);
                toast.success('Book updated successfully');
            } else {
                await api.post('/books', data);
                toast.success('Book created successfully');
            }
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || 'Failed to save book');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    {...register('title')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                    Author
                </label>
                <input
                    id="author"
                    type="text"
                    {...register('author')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>}
            </div>

            <div>
                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                    ISBN
                </label>
                <input
                    id="isbn"
                    type="text"
                    {...register('isbn')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.isbn && <p className="mt-1 text-sm text-red-600">{errors.isbn.message}</p>}
            </div>

            <div>
                <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">
                    Publisher
                </label>
                <input
                    id="publisher"
                    type="text"
                    {...register('publisher')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.publisher && <p className="mt-1 text-sm text-red-600">{errors.publisher.message}</p>}
            </div>

            <div>
                <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700">
                    Publication Year
                </label>
                <input
                    id="publicationYear"
                    type="number"
                    {...register('publicationYear', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.publicationYear && (
                    <p className="mt-1 text-sm text-red-600">{errors.publicationYear.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                    Genre
                </label>
                <input
                    id="genre"
                    type="text"
                    {...register('genre')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    rows={3}
                    {...register('description')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
                    Cover Image URL (optional)
                </label>
                <input
                    id="coverImage"
                    type="text"
                    {...register('coverImage')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="totalCopies" className="block text-sm font-medium text-gray-700">
                    Total Copies
                </label>
                <input
                    id="totalCopies"
                    type="number"
                    {...register('totalCopies', { valueAsNumber: true })}
                    onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setValue('totalCopies', value);
                        setValue('availableCopies', value);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.totalCopies && (
                    <p className="mt-1 text-sm text-red-600">{errors.totalCopies.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="availableCopies" className="block text-sm font-medium text-gray-700">
                    Available Copies
                </label>
                <input
                    id="availableCopies"
                    type="number"
                    {...register('availableCopies', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    disabled
                />
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
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
}