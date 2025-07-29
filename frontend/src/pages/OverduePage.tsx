import { useState, useEffect } from 'react';
import { OverdueTable } from '../components/tables/OverdueTable';
import { useAppContext } from '../context/BookContext';
import { getOverdueLendings, sendOverdueNotifications } from '../services/LendingService';

export const OverduePage = () => {
    const { overdue, setOverdue } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [notificationSent, setNotificationSent] = useState(false);

    const loadOverdue = async () => {
        setIsLoading(true);
        try {
            const data = await getOverdueLendings();
            setOverdue(data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOverdue();
    }, []);

    const handleNotifyAll = async () => {
        setIsLoading(true);
        try {
            await sendOverdueNotifications();
            setNotificationSent(true);
            setTimeout(() => setNotificationSent(false), 3000);
            await loadOverdue();
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotifySingle = async (readerId: string) => {
        // In a real implementation, you might have a separate service method for single notifications
        // For now, we'll just show a confirmation
        alert(`Notification sent to reader ${readerId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Overdue Books</h1>
                <button
                    onClick={handleNotifyAll}
                    disabled={isLoading || overdue.length === 0}
                    className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 ${
                        isLoading || overdue.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? 'Sending...' : 'Notify All Readers'}
                </button>
            </div>

            {notificationSent && (
                <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
                    Notifications sent successfully!
                </div>
            )}

            {isLoading && overdue.length === 0 ? (
                <p>Loading overdue items...</p>
            ) : overdue.length === 0 ? (
                <p className="text-gray-500">No overdue books at this time.</p>
            ) : (
                <OverdueTable
                    overdueItems={overdue}
                    onNotify={handleNotifySingle}
                />
            )}
        </div>
    );
};