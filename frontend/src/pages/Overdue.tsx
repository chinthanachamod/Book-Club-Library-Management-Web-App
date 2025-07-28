import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import OverdueTable from '../components/tables/OverdueTable';
import Button from '../components/ui/Button';
import type { Lending } from '../types';

export default function Overdue() {
    const { data: overdueLendings, refetch } = useQuery<Lending[]>({
        queryKey: ['overdue-lendings'],
        queryFn: async () => {
            const response = await api.get('/lendings/overdue');
            return response.data;
        }
    });

    const notifyMutation = useMutation({
        mutationFn: () => api.post('/notifications/overdue'),
        onSuccess: () => {
            toast.success('Notifications sent successfully');
            void refetch(); // Explicitly handling the promise with void
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'Failed to send notifications');
        },
    });

    const handleNotifyAll = () => {
        if (confirm('Send overdue notifications to all readers?')) {
            notifyMutation.mutate();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Overdue Books</h1>
                {(overdueLendings && overdueLendings.length > 0) && (
                    <Button onClick={handleNotifyAll}>
                        Notify All
                    </Button>
                )}
            </div>

            <OverdueTable
                lendings={overdueLendings || []}
            />
        </div>
    );
}