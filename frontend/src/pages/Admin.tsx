import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../services/api';
import UserTable from '../components/tables/UserTable';
import UserForm from '../components/forms/UserForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import type { User } from '../types'; // Import the User type from your types file

export default function Admin() {
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data: users } = useQuery<User[], AxiosError>({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get<User[]>('/admin/users');
            return response.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/admin/users/${id}`),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User deleted successfully');
        },
        onError: (error: AxiosError<{ error?: { message?: string } }>) => {
            toast.error(
                error.response?.data?.error?.message || 'Failed to delete user'
            );
        },
    });

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Admin - User Management</h1>
                <Button onClick={() => {
                    setSelectedUser(null);
                    setIsFormOpen(true);
                }}>
                    Add User
                </Button>
            </div>

            <UserTable
                users={users || []}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={selectedUser ? 'Edit User' : 'Add User'}
            >
                <UserForm
                    user={selectedUser}
                    onSuccess={async () => {
                        setIsFormOpen(false);
                        await queryClient.invalidateQueries({ queryKey: ['users'] });
                    }}
                />
            </Modal>
        </div>
    );
}