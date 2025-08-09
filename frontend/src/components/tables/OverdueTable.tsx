/*
import React from 'react';
import type { Lending } from '../../types/Lending';

interface OverdueTableProps {
    overdueLendings: Lending[];
    onMarkReturned: (id: string) => void;
}

const OverdueTable: React.FC<OverdueTableProps> = ({ overdueLendings, onMarkReturned }) => {
    return (
        <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-red-100">
                <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Reader ID</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Book ID</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Lend Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Due Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {overdueLendings.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                            No overdue lending records.
                        </td>
                    </tr>
                ) : (
                    overdueLendings.map((lending, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{lending.readerId}</td>
                            <td className="px-4 py-2">{lending.bookId}</td>
                            <td className="px-4 py-2">{new Date(lending.lendDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{new Date(lending.dueDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2 capitalize text-red-600">{lending.status}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => onMarkReturned(lending._id)}
                                    className="text-green-600 hover:underline text-sm"
                                >
                                    Mark Returned
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default OverdueTable;*/
import React from 'react';
import type { Lending } from '../../types/Lending';

interface OverdueTableProps {
    overdueLendings: Lending[];
    onMarkReturned: (id: string) => void | Promise<void>; // can be async
    isProcessing: boolean; // ✅ added
}

const OverdueTable: React.FC<OverdueTableProps> = ({
                                                       overdueLendings,
                                                       onMarkReturned,
                                                       isProcessing
                                                   }) => {
    return (
        <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-red-100">
                <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Reader ID</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Book ID</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Lend Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Due Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {overdueLendings.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                            No overdue lending records.
                        </td>
                    </tr>
                ) : (
                    overdueLendings.map((lending, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{lending.readerId}</td>
                            <td className="px-4 py-2">{lending.bookId}</td>
                            <td className="px-4 py-2">{new Date(lending.lendDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{new Date(lending.dueDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2 capitalize text-red-600">{lending.status}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => onMarkReturned(lending._id)}
                                    disabled={isProcessing} // ✅ disabled while processing
                                    className={`text-green-600 hover:underline text-sm ${
                                        isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isProcessing ? 'Processing...' : 'Mark Returned'}
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default OverdueTable;
