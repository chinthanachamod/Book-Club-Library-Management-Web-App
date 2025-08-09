import { useEffect, useState } from "react";
import { Mail, Menu } from "lucide-react";
import {
    getDashboardStats,
    getOverdueLendings,
    type DashboardStats,
    type OverdueLending,
} from "../services/DashboardService";
import { sendOverdueEmails } from "../services/OverdueService";
import { useSidebar } from "../context/SidebarContext.tsx";
import { motion } from "framer-motion";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";

const DashboardPage = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalReaders: 0,
        totalBooks: 0,
        totalBorrowed: 0,
        totalOverdue: 0,
    });
    const [overdueList, setOverdueList] = useState<OverdueLending[]>([]);
    const [mailSending, setMailSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const { openSidebar } = useSidebar();

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, overdueData] = await Promise.all([
                    getDashboardStats(),
                    getOverdueLendings()
                ]);
                setStats(statsData);
                setOverdueList(overdueData);
            } catch (error) {
                toast.error("Failed to load dashboard data");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSendNotifications = async () => {
        if (!confirm("Send overdue notifications to all readers?")) return;

        try {
            setMailSending(true);
            await sendOverdueEmails();
            toast.success("Notifications sent successfully");
        } catch (error) {
            toast.error("Failed to send notifications");
            console.error(error);
        } finally {
            setMailSending(false);
        }
    };

    // Format date and time
    const formattedDate = currentTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50"
                >
                    <div className="bg-white p-8 rounded-xl shadow-xl border border-blue-200 flex flex-col items-center">
                        <PulseLoader color="#3B82F6" size={15} />
                        <p className="text-blue-600 mt-4 font-medium">Loading dashboard...</p>
                    </div>
                </motion.div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden mb-6">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openSidebar}
                    className="p-2 rounded-lg bg-white shadow-sm border border-blue-200"
                >
                    <Menu className="text-blue-600" size={28} />
                </motion.button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header Section with Date/Time */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h1 className="text-3xl font-bold text-blue-800 mb-2">Library Dashboard</h1>
                        <p className="text-blue-600">Overview of your library's current status</p>
                    </motion.div>

                    {/* Date/Time Panel */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-4 rounded-lg shadow-sm border border-blue-200 min-w-[200px]"
                    >
                        <div className="text-center">
                            <div className="text-2xl font-medium text-blue-800">
                                {formattedTime}
                            </div>
                            <div className="text-sm text-blue-600 mt-1">
                                {formattedDate}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    <StatCard
                        label="Total Readers"
                        value={stats.totalReaders}
                        icon={<UsersIcon />}
                        trend="up"
                        change="5% from last month"
                    />
                    <StatCard
                        label="Books in Library"
                        value={stats.totalBooks}
                        icon={<BooksIcon />}
                        trend="neutral"
                    />
                    <StatCard
                        label="Books Borrowed"
                        value={stats.totalBorrowed}
                        icon={<BookCheckIcon />}
                        trend="up"
                        change="12% from last week"
                    />
                    <StatCard
                        label="Overdue Books"
                        value={stats.totalOverdue}
                        icon={<ClockAlertIcon />}
                        trend={stats.totalOverdue > 0 ? "down" : "neutral"}
                        change={stats.totalOverdue > 0 ? "Needs attention" : "All clear"}
                    />
                </motion.div>

                {/* Overdue Lendings Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden"
                >
                    <div className="p-6 bg-gradient-to-r from-blue-800 to-blue-700">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <ClockAlertIcon white />
                                    Overdue Lendings
                                </h2>
                                <p className="text-blue-200 text-sm mt-1">
                                    {overdueList.length} item{overdueList.length !== 1 ? 's' : ''} overdue
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleSendNotifications}
                                disabled={mailSending || overdueList.length === 0}
                                className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 ${
                                    mailSending || overdueList.length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-white hover:bg-blue-50 text-blue-700 shadow-md'
                                }`}
                            >
                                {mailSending ? (
                                    <PulseLoader color="#3B82F6" size={6} />
                                ) : (
                                    <>
                                        <Mail className="w-5 h-5" />
                                        Send Reminders
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {overdueList.length > 0 ? (
                            <table className="min-w-full divide-y divide-blue-200">
                                <thead className="bg-blue-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Book Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Reader</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Days Overdue</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-blue-200">
                                {overdueList.map((entry, idx) => {
                                    const daysOverdue = Math.floor(
                                        (new Date().getTime() - new Date(entry.dueDate).getTime()) /
                                        (1000 * 3600 * 24)
                                    );

                                    return (
                                        <motion.tr
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: idx * 0.05 }}
                                            className="hover:bg-blue-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                                                {entry.bookTitle}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                                                {entry.readerName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                                <a href={`mailto:${entry.email}`} className="hover:underline">
                                                    {entry.email}
                                                </a>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                                daysOverdue > 7 ? 'text-red-600' : 'text-amber-600'
                                            }`}>
                                                {daysOverdue} day{daysOverdue !== 1 ? 's' : ''}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                                    <CheckCircleIcon />
                                </div>
                                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                                    No Overdue Books
                                </h3>
                                <p className="text-blue-500">
                                    All books have been returned on time
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

const StatCard = ({
                      label,
                      value,
                      icon,
                      trend = "neutral",
                      change
                  }: {
    label: string;
    value: number;
    icon: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    change?: string;
}) => {
    const trendColors = {
        up: "text-emerald-500",
        down: "text-red-500",
        neutral: "text-blue-500"
    };

    const trendIcons = {
        up: "↑",
        down: "↓",
        neutral: ""
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-all duration-300"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-blue-800">{value}</p>
                    {change && (
                        <p className={`text-xs mt-2 flex items-center ${trendColors[trend]}`}>
                            <span className="mr-1">{trendIcons[trend]}</span>
                            {change}
                        </p>
                    )}
                </div>
                <div className="text-3xl text-blue-500">
                    {icon}
                </div>
            </div>
        </motion.div>
    );
};

// Custom Icons
const UsersIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const BooksIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const BookCheckIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ClockAlertIcon = ({ white = false }: { white?: boolean }) => (
    <svg className="w-6 h-6" fill="none" stroke={white ? "white" : "currentColor"} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default DashboardPage;