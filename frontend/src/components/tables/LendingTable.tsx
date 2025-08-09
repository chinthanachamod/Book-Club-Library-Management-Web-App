import React from 'react';
import type { Lending } from '../../types/Lending';
import {BookCheck, Pencil, Trash2} from "lucide-react";

interface LendingTableProps {
    lendings: Lending[];
    onEdit: (lending: Lending) => void;
    onDelete: (id: string) => void;
    onMarkReturned: (id: string) => void;
}

const LendingTable: React.FC<LendingTableProps> = ({
                                                       lendings,
                                                       onEdit,
                                                       onDelete,
                                                       onMarkReturned,
                                                   }) => {
    return (
        <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Reader ID</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Book ID</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Lend Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Due Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {lendings.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                            No lending records found.
                        </td>
                    </tr>
                ) : (
                    lendings.map((lending, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{lending.readerId}</td>
                            <td className="px-4 py-2">{lending.bookId}</td>
                            <td className="px-4 py-2">{new Date(lending.lendDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{new Date(lending.dueDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2 capitalize">{lending.status}</td>
                            <td className="px-4 py-2 space-x-2">
                                <button
                                    onClick={() => onEdit(lending)}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    <Pencil />
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm("Are you sure you want to delete this lending?")) {
                                            onDelete(lending._id);
                                        }
                                    }}
                                    className="text-red-600 hover:underline text-sm"
                                >
                                    <Trash2 />
                                </button>
                                {lending.status === 'lent' && (
                                    <button
                                        onClick={() => onMarkReturned(lending._id)}
                                        className="text-green-600 hover:underline text-sm"
                                    >
                                        <BookCheck />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default LendingTable;