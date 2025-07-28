import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import StatsCard from '../components/dashboard/StatsCard';
import RecentLendings from '../components/dashboard/RecentLendings';
import { AxiosError } from 'axios';

interface DashboardStats {
    totalBooks: number;
    booksChange: number;
    availableBooks: number;
    availableChange: number;
    totalReaders: number;
    readersChange: number;
    overdueBooks: number;
    overdueChange: number;
}

export default function Dashboard() {
    const { data: stats } = useQuery<DashboardStats, AxiosError>({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const response = await api.get<DashboardStats>('/dashboard/stats');
            return response.data;
        }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

            {stats && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Books"
                        value={stats.totalBooks}
                        change={stats.booksChange}
                        icon="book"
                    />
                    <StatsCard
                        title="Available Books"
                        value={stats.availableBooks}
                        change={stats.availableChange}
                        icon="check"
                    />
                    <StatsCard
                        title="Total Readers"
                        value={stats.totalReaders}
                        change={stats.readersChange}
                        icon="people"
                    />
                    <StatsCard
                        title="Overdue Books"
                        value={stats.overdueBooks}
                        change={stats.overdueChange}
                        icon="warning"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <RecentLendings />
            </div>
        </div>
    );
}