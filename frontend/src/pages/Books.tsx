import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import BookTable from '../components/tables/BookTable';
import BookForm from '../components/forms/BookForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { AxiosError } from 'axios';
import type { Book } from '../types'; // Import your Book type

export default function Books() {
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const { data: books } = useQuery<Book[], AxiosError>({
        queryKey: ['books'],
        queryFn: async () => {
            const response = await api.get<Book[]>('/books');
            return response.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/books/${id}`),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['books'] });
            toast.success('Book deleted successfully');
        },
        onError: (error: AxiosError<{ error?: { message?: string } }>) => {
            toast.error(
                error.response?.data?.error?.message || 'Failed to delete book'
            );
        }
    });

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this book?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleEdit = (book: Book) => {
        setSelectedBook(book);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Books</h1>
                <Button onClick={() => {
                    setSelectedBook(null);
                    setIsFormOpen(true);
                }}>
                    Add Book
                </Button>
            </div>

            <BookTable
                books={books || []}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={selectedBook ? 'Edit Book' : 'Add Book'}
            >
                <BookForm
                    book={selectedBook}
                    onSuccess={async () => {
                        setIsFormOpen(false);
                        await queryClient.invalidateQueries({ queryKey: ['books'] });
                    }}
                />
            </Modal>
        </div>
    );
}