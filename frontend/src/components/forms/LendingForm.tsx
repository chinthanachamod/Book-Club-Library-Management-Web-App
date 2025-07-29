import { useState, useEffect } from 'react';
import type { Lending, Book, Reader } from '../../types';
import { getBooks } from '../../services/BookService';
import { getReaders } from '../../services/ReaderService';

interface LendingFormProps {
    initialData?: Lending;
    onSubmit: (lending: Omit<Lending, 'id'>) => void;
    onCancel: () => void;
}

export const LendingForm = ({ initialData, onSubmit, onCancel }: LendingFormProps) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [readers, setReaders] = useState<Reader[]>([]);
    const [lending, setLending] = useState<Omit<Lending, 'id'>>(
        initialData || {
            bookId: '',
            readerId: '',
            borrowedDate: new Date().toISOString().split('T')[0],
            dueDate: '',
            returnedDate: null,
        }
    );

    useEffect(() => {
        const fetchData = async () => {
            const [booksData, readersData] = await Promise.all([
                getBooks(),
                getReaders(),
            ]);
            setBooks(booksData);
            setReaders(readersData);

            if (!initialData) {
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + 14);
                setLending(prev => ({
                    ...prev,
                    dueDate: dueDate.toISOString().split('T')[0],
                }));
            }
        };
        fetchData();
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLending(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(lending);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">
                {initialData ? 'Edit Lending Record' : 'Create New Lending'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Book *</label>
                    <select
                        name="bookId"
                        value={lending.bookId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border bg-white"
                        required
                    >
                        <option value="">Select a book</option>
                        {books.map(book => (
                            <option key={book.id} value={book.id} className="text-gray-700">
                                {book.title} by {book.author}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Reader *</label>
                    <select
                        name="readerId"
                        value={lending.readerId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border bg-white"
                        required
                    >
                        <option value="">Select a reader</option>
                        {readers.map(reader => (
                            <option key={reader.id} value={reader.id} className="text-gray-700">
                                {reader.name} ({reader.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Borrowed Date *</label>
                    <input
                        type="date"
                        name="borrowedDate"
                        value={lending.borrowedDate}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Due Date *</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={lending.dueDate}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border"
                        required
                    />
                </div>

                {initialData?.returnedDate && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Returned Date</label>
                        <input
                            type="date"
                            name="returnedDate"
                            value={lending.returnedDate || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border"
                        />
                    </div>
                )}
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
                    {initialData ? 'Update Lending' : 'Create Lending'}
                </button>
            </div>
        </form>
    );
};