import { useState } from 'react';
import type { Book } from '../../types';

interface BookFormProps {
    initialData?: Book;
    onSubmit: (book: Omit<Book, 'id'>) => Promise<void>;
    onCancel: () => void;
}

export const BookForm = ({ initialData, onSubmit, onCancel }: BookFormProps) => {
    const [book, setBook] = useState<Omit<Book, 'id'>>(
        initialData || {
            title: '',
            author: '',
            isbn: '',
            publishedYear: new Date().getFullYear(),
            quantity: 1,
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBook(prev => ({
            ...prev,
            [name]: name === 'publishedYear' || name === 'quantity' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(book);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {initialData ? 'Edit Book Details' : 'Add New Book'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={book.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border"
                        required
                        placeholder="Enter book title"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Author *</label>
                    <input
                        type="text"
                        name="author"
                        value={book.author}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border"
                        required
                        placeholder="Enter author name"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">ISBN *</label>
                    <input
                        type="text"
                        name="isbn"
                        value={book.isbn}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border"
                        required
                        placeholder="Enter ISBN number"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Published Year</label>
                    <input
                        type="number"
                        name="publishedYear"
                        value={book.publishedYear}
                        onChange={handleChange}
                        min="1900"
                        max={new Date().getFullYear()}
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={book.quantity}
                        onChange={handleChange}
                        min="1"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-150"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-indigo-600 to-indigo-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-150"
                >
                    {initialData ? 'Update Book' : 'Add Book'}
                </button>
            </div>
        </form>
    );
};