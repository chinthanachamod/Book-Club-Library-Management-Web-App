import type { Lending, Book, Reader } from '../../types';
import { format } from 'date-fns';

interface LendingTableProps {
    lendings: Lending[];
    books: Book[];
    readers: Reader[];
    onReturn: (id: string) => void;
    onEdit: (lending: Lending) => void;
    onDelete: (id: string) => void;
}

export const LendingTable = ({ lendings, books, readers, onReturn, onEdit, onDelete }: LendingTableProps) => {
    const getBookTitle = (bookId: string) => {
        const book = books.find(b => b.id === bookId);
        return book ? `${book.title} (${book.isbn})` : 'Unknown Book';
    };

    const getReaderName = (readerId: string) => {
        const reader = readers.find(r => r.id === readerId);
        return reader ? `${reader.name} (${reader.email})` : 'Unknown Reader';
    };

    const getDaysOverdue = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = Math.max(0, today.getTime() - due.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg bg-white">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-700 to-indigo-600">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Book Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Reader Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Dates
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                {lendings.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-700">No lending records found</h3>
                                <p className="text-gray-500 mt-1">When you lend books, they'll appear here</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    lendings.map((lending) => {
                        const isOverdue = !lending.returnedDate && new Date(lending.dueDate) < new Date();
                        const daysOverdue = isOverdue ? getDaysOverdue(lending.dueDate) : 0;

                        return (
                            <tr
                                key={lending.id}
                                className={`transition-colors ${isOverdue ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-indigo-50'}`}
                            >
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{getBookTitle(lending.bookId)}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600">{getReaderName(lending.readerId)}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600">
                                        <div className="font-medium">Borrowed:</div>
                                        {format(new Date(lending.borrowedDate), 'MMM dd, yyyy')}
                                    </div>
                                    <div className="text-sm mt-1">
                                        <div className="font-medium">Due:</div>
                                        <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                                {format(new Date(lending.dueDate), 'MMM dd, yyyy')}
                                            {isOverdue && (
                                                <span className="ml-1 text-xs">({daysOverdue} days late)</span>
                                            )}
                                            </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {lending.returnedDate ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                                Returned
                                            </span>
                                    ) : isOverdue ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                                                Overdue
                                            </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                                Borrowed
                                            </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    {!lending.returnedDate && (
                                        <button
                                            onClick={() => onReturn(lending.id)}
                                            className="inline-flex items-center px-3 py-1.5 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Return
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onEdit(lending)}
                                        className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-md transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(lending.id)}
                                        className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
};