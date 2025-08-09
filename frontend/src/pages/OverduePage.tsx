import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import OverdueTable from '../components/tables/OverdueTable';
import { fetchOverdueLendings } from '../services/OverdueService.ts';
import type { Lending } from '../types/Lending';
import apiClient from '../services/ApiClient';
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';

const OverduePage = () => {
    const [overdueLendings, setOverdueLendings] = useState<Lending[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const getOverdueLendings = async () => {
        setIsLoading(true);
        try {
            const data = await fetchOverdueLendings();
            setOverdueLendings(data);
        } catch (error) {
            toast.error("Failed to fetch overdue lendings");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getOverdueLendings();
    }, []);

    const handleMarkReturned = async (id: string) => {
        if (!confirm("Are you sure you want to mark this lending as returned?")) return;

        try {
            setIsProcessing(true);
            await apiClient.put(`/lendings/${id}/return`);
            toast.success("Lending marked as returned");
            getOverdueLendings(); // Refresh list after marking returned
        } catch (error) {
            toast.error("Failed to mark as returned");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50"
            >
                <div className="bg-white p-8 rounded-xl shadow-xl border border-blue-200">
                    <PulseLoader color="#3B82F6" size={15} />
                    <p className="text-blue-600 mt-4 text-center font-medium">Loading overdue lendings...</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6"
        >
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-xl shadow-md border border-blue-200 p-6"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Overdue Lendings
                            </h1>
                            <p className="text-blue-500 mt-2">Manage and track overdue book returns</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={getOverdueLendings}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition-all duration-300 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </motion.button>
                    </div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <StatCard
                        label="Total Overdue"
                        value={overdueLendings.length}
                        icon={<ClockIcon />}
                        color="bg-blue-100 text-blue-800"
                    />
                    <StatCard
                        label="Recently Overdue"
                        value={overdueLendings.filter(l => {
                            const daysOverdue = Math.floor((new Date().getTime() - new Date(l.dueDate).getTime()) / (1000 * 3600 * 24));
                            return daysOverdue <= 7;
                        }).length}
                        icon={<AlertIcon />}
                        color="bg-amber-100 text-amber-800"
                    />
                    <StatCard
                        label="Long Overdue"
                        value={overdueLendings.filter(l => {
                            const daysOverdue = Math.floor((new Date().getTime() - new Date(l.dueDate).getTime()) / (1000 * 3600 * 24));
                            return daysOverdue > 7;
                        }).length}
                        icon={<WarningIcon />}
                        color="bg-red-100 text-red-800"
                    />
                    <StatCard
                        label="Potential Fines"
                        value={`$${overdueLendings.length * 5}`}
                        icon={<DollarIcon />}
                        color="bg-emerald-100 text-emerald-800"
                    />
                </motion.div>

                {/* Overdue Table Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden"
                >
                    {overdueLendings.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-blue-600 mb-2">No Overdue Lendings</h3>
                            <p className="text-blue-500">All books have been returned on time</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 bg-gradient-to-r from-blue-800 to-blue-700">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Overdue Records
                                </h2>
                                <p className="text-blue-200 text-sm mt-1">
                                    {overdueLendings.length} overdue item{overdueLendings.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="p-1">
                                <OverdueTable
                                    overdueLendings={overdueLendings}
                                    onMarkReturned={handleMarkReturned}
                                    isProcessing={isProcessing}
                                />
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

const StatCard = ({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`p-5 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-all duration-300 ${color.split(' ')[0]}`}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-2xl font-bold mt-2">{value}</p>
            </div>
            <div className="text-3xl">
                {icon}
            </div>
        </div>
    </motion.div>
);

const ClockIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AlertIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const WarningIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const DollarIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default OverduePage;