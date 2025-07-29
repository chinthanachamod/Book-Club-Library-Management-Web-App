import { useAppContext } from '../context/BookContext';

export const DashboardPage = () => {
    const { books, readers, lendings, overdue } = useAppContext();

    const stats = [
        { name: 'Total Books', value: books.length, icon: '📚' },
        { name: 'Registered Readers', value: readers.length, icon: '👥' },
        { name: 'Active Lendings', value: lendings.filter(l => !l.returnedDate).length, icon: '📖' },
        { name: 'Overdue Books', value: overdue.length, icon: '⏰' },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Library Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <span className="text-2xl mr-4">{stat.icon}</span>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {lendings.slice(0, 5).map((lending) => (
                        <div key={lending.id} className="border-b pb-3 last:border-0">
                            <p className="font-medium">Book #{lending.bookId} borrowed</p>
                            <p className="text-sm text-gray-500">
                                Due: {new Date(lending.dueDate).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};