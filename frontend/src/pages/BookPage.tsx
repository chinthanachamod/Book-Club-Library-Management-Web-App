import { useState } from 'react';
import { BookForm } from '../components/forms/BookForm';
import { BookTable } from '../components/tables/BookTable';
import { useAppContext } from '../context/BookContext';
import { getBooks, addBook, updateBook, deleteBook } from '../services/BookService';
import type {Book} from "../types";

export const BookPage = () => {
    const { books, setBooks } = useAppContext();
    const [showForm, setShowForm] = useState(false);
    const [currentBook, setCurrentBook] = useState<Book | null>(null);

    const loadBooks = async () => {
        const data = await getBooks();
        setBooks(data);
    };

    const handleAdd = async (book: Omit<Book, 'id'>) => {
        await addBook(book);
        await loadBooks();
        setShowForm(false);
    };

    const handleUpdate = async (book: Omit<Book, 'id'>) => {
        if (!currentBook) return;
        await updateBook(currentBook.id, book);
        await loadBooks();
        setCurrentBook(null);
        setShowForm(false);
    };

    const handleDelete = async (id: string) => {
        await deleteBook(id);
        await loadBooks();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Book Management</h1>
                <button
                    onClick={() => {
                        setCurrentBook(null);
                        setShowForm(true);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Add New Book
                </button>
            </div>

            {showForm ? (
                <BookForm
                    initialData={currentBook || undefined}
                    onSubmit={currentBook ? handleUpdate : handleAdd}
                    onCancel={() => {
                        setShowForm(false);
                        setCurrentBook(null);
                    }}
                />
            ) : (
                <BookTable
                    books={books}
                    onEdit={(book) => {
                        setCurrentBook(book);
                        setShowForm(true);
                    }}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};