import type { Lending } from '../../types';
import { format } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import type { AxiosResponse } from 'axios';

interface OverdueTableProps {
    lendings: Lending[];
}

export default function OverdueTable({ lendings }: OverdueTableProps) {
    const notifyMutation = useMutation<AxiosResponse<any>, Error, string>({
        mutationFn: (id: string) => api.post(`/notifications/overdue/${id}`),
        onSuccess: () => {
            toast.success('Notification sent successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'Failed to send notification');
        },
    });

    const handleNotify = (id: string) => {
        if (confirm('Send overdue notification to this reader?')) {
            notifyMutation.mutate(id);
        }
    };

    return (
        <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5">
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Book</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reader</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Due Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Days Overdue</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {lendings?.map((lending) => {
                    const dueDate = new Date(lending.dueDate);
                    const today = new Date();
                    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

                    return (
                        <tr key={lending.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {typeof lending.book === 'object' ? lending.book.title : 'Loading...'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {typeof lending.reader === 'object' ? (
                                    <>
                                        <div>{lending.reader.name}</div>
                                        <div>{lending.reader.email}</div>
                                        <div>{lending.reader.phone}</div>
                                    </>
                                ) : (
                                    'Loading...'
                                )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {format(dueDate, 'MMM d, yyyy')}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span className="font-semibold text-red-600">{daysOverdue}</span> days
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button
                                    onClick={() => handleNotify(lending.id)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    Notify
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
