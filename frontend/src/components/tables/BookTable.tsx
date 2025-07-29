import type { Book } from '../../types';

interface BookTableProps {
    books: Book[];
    onEdit: (book: Book) => void;
    onDelete: (id: string) => void;
}

export const BookTable = ({ books, onEdit, onDelete }: BookTableProps) => {
    return (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Author
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        ISBN
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Year
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
                {books.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-700">No books available</h3>
                                <p className="text-gray-500 mt-1">Add books to populate your library</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    books.map((book) => (
                        <tr key={book.id} className="hover:bg-indigo-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{book.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600">{book.author}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                                    {book.isbn}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600">
                                    {book.publishedYear}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                        book.quantity > 5
                                            ? 'bg-green-100 text-green-800'
                                            : book.quantity > 0
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'bg-red-100 text-red-800'
                                    }`}>
                                        {book.quantity > 0 ? (
                                            <>
                                                <span className={`w-2 h-2 rounded-full mr-2 ${
                                                    book.quantity > 5 ? 'bg-green-500' : 'bg-amber-500'
                                                }`}></span>
                                                {book.quantity} in stock
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                                                Out of stock
                                            </>
                                        )}
                                    </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                <button
                                    onClick={() => onEdit(book)}
                                    className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-md transition-colors duration-150"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(book.id)}
                                    className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-colors duration-150"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
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