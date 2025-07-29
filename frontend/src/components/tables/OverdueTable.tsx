import type { Overdue } from '../../types';
import { format } from 'date-fns';

interface OverdueTableProps {
    overdueItems: Overdue[];
    onNotify: (readerId: string) => void;
}

export const OverdueTable = ({ overdueItems, onNotify }: OverdueTableProps) => {
    return (
        <div className="overflow-x-auto rounded-xl shadow-md border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-red-600 to-red-500">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Reader
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Book
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Days Overdue
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                {overdueItems.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-8 text-center">
                            <div className="text-gray-500 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-700">No overdue items</h3>
                            <p className="text-gray-500 mt-1">All books have been returned on time</p>
                        </td>
                    </tr>
                ) : (
                    overdueItems.map((item) => (
                        <tr key={item.id} className="bg-red-50 hover:bg-red-100 transition-colors">
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{item.reader.name}</div>
                                <div className="text-xs text-gray-500 mt-1">{item.reader.email}</div>
                                <div className="text-xs text-gray-500">{item.reader.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{item.book.title}</div>
                                <div className="text-xs text-gray-500 mt-1">by {item.book.author}</div>
                                <div className="text-xs text-gray-500 font-mono">ISBN: {item.book.isbn}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                            </td>
                            <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                        item.daysOverdue > 14
                                            ? 'bg-red-100 text-red-800'
                                            : item.daysOverdue > 7
                                                ? 'bg-orange-100 text-orange-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {item.daysOverdue} days
                                    </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                                <button
                                    onClick={() => onNotify(item.reader.id)}
                                    className="inline-flex items-center text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-3 py-1 rounded-md shadow-sm transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Send Reminder
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