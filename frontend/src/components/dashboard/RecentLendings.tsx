import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { format } from 'date-fns';

export default function RecentLendings() {
    const { data: lendings } = useQuery({
        queryKey: ['recent-lendings'],
        queryFn: async () => {
            const response = await api.get('/lendings?limit=5');
            return response.data;
        }
    });


    // @ts-ignore
    // @ts-ignore
    return (
        <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Lendings</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Book
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reader
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {lendings?.map((lending: any) => (
                        <tr key={lending.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{lending.book.title}</div>
                                <div className="text-sm text-gray-500">{lending.book.author}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{lending.reader.name}</div>
                                <div className="text-sm text-gray-500">{lending.reader.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {format(new Date(lending.dueDate), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          lending.status === 'returned'
                              ? 'bg-green-100 text-green-800'
                              : lending.status === 'overdue'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {lending.status}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}