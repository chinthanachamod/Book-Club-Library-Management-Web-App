import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Removed QueryClient import
import api from '../services/api';
import { toast } from 'react-hot-toast';
import LendingTable from '../components/tables/LendingTable';
import LendingForm from '../components/forms/LendingForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import type {Lending} from '../types';

export default function Lendings() {
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { data: lendings } = useQuery<Lending[]>({
        queryKey: ['lendings'],
        queryFn: async () => {
            const response = await api.get('/lendings');
            return response.data;
        }
    });

    const returnMutation = useMutation({
        mutationFn: (id: string) => api.put(`/lendings/${id}/return`),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['lendings'] }); // Added void
            toast.success('Book returned successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'Failed to return book');
        },
    });

    const handleReturn = (id: string) => {
        if (confirm('Mark this book as returned?')) {
            returnMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Lendings</h1>
                <Button onClick={() => setIsFormOpen(true)}>
                    Lend Book
                </Button>
            </div>

            <LendingTable
                lendings={lendings || []}
                onReturn={handleReturn}
            />

            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title="Lend Book"
            >
                <LendingForm
                    onSuccess={() => {
                        setIsFormOpen(false);
                        void queryClient.invalidateQueries({ queryKey: ['lendings'] }); // Added void
                        void queryClient.invalidateQueries({ queryKey: ['books'] }); // Added void
                    }}
                />
            </Modal>
        </div>
    );
}