import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import ReaderTable from '../components/tables/ReaderTable';
import ReaderForm from '../components/forms/ReaderForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import type { Reader } from '../types'; // Make sure to import your Reader type

export default function Readers() {
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedReader, setSelectedReader] = useState<Reader | null>(null);

    const { data: readers } = useQuery<Reader[]>({
        queryKey: ['readers'],
        queryFn: async () => {
            const response = await api.get('/readers');
            return response.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/readers/${id}`),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['readers'] });
            toast.success('Reader deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'Failed to delete reader');
        },
    });

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this reader?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleEdit = (reader: Reader) => {
        setSelectedReader(reader);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Readers</h1>
                <Button onClick={() => {
                    setSelectedReader(null);
                    setIsFormOpen(true);
                }}>
                    Add Reader
                </Button>
            </div>

            <ReaderTable
                readers={readers || []}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={selectedReader ? 'Edit Reader' : 'Add Reader'}
            >
                <ReaderForm
                    reader={selectedReader}
                    onSuccess={() => {
                        setIsFormOpen(false);
                        void queryClient.invalidateQueries({ queryKey: ['readers'] });
                    }}
                />
            </Modal>
        </div>
    );
}


/*
- Fetches and displays reader list using React Query
- Supports adding and editing readers via modal with ReaderForm
- Enables deleting readers with confirmation and mutation handling
- Uses custom UI components: ReaderTable, Modal, and Button
- Shows toast notifications on success and error
*/
