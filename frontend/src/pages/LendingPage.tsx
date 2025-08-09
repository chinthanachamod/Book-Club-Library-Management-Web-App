import { useEffect, useState } from 'react';
import Dialog from '../components/Dialog';
import LendingForm from '../components/forms/LendingForm';
import LendingTable from '../components/tables/LendingTable';
import type { Lending } from '../types/Lending';
import {
    lendBook,
    fetchAllLendings,
    markAsReturned,
    removeLending,
} from '../services/LendingService';
import toast from 'react-hot-toast';
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';

const LendingPage = () => {
    const [lendings, setLendings] = useState<Lending[]>([]);
    const [selectedLending, setSelectedLending] = useState<Lending | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Omit<Lending, 'id' | 'status' | 'returnDate'> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const loadLendings = async () => {
        try {
            setIsLoading(true);
            const data = await fetchAllLendings();
            setLendings(data);
        } catch (error) {
            toast.error("Failed to load lendings");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLendings();
    }, []);

    const handleAddOrUpdate = async (
        data: Omit<Lending, 'id' | 'status' | 'returnDate'>) => {
        try {
            if (selectedLending) {
                toast.error("Updating lendings is not implemented yet.");
            } else {
                const newLending = await lendBook(data);
                setLendings(prev => [...prev, newLending]);
                toast.success("Lending added successfully");
            }
            closeDialog();
        } catch (error) {
            toast.error("Failed to save lending");
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this lending record?")) return;
        try {
            await removeLending(id);
            setLendings(prev => prev.filter(l => l._id !== id));
            toast.success("Lending deleted");
        } catch (error) {
            toast.error("Failed to delete lending");
            console.error(error);
        }
    };

    const handleEdit = (lending: Lending) => {
        setSelectedLending(lending);
        setFormData({
            _id: "",
            readerId: lending.readerId,
            bookId: lending.bookId,
            lendDate: lending.lendDate,
            dueDate: lending.dueDate
        });
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedLending(null);
        setFormData(null);
        setIsModalOpen(true);
    };

    const handleMarkReturnedClick = async (id: string) => {
        try {
            const updatedLending = await markAsReturned(id);
            setLendings(prev =>
                prev.map(l => (l._id === id ? updatedLending : l))
            );
            toast.success("Marked as returned");
        } catch (error) {
            toast.error("Failed to mark as returned");
            console.error(error);
        }
    };

    const handleDialogConfirm = () => {
        if (formData) {
            handleAddOrUpdate(formData);
        } else {
            toast.error("Please fill the form before confirming");
        }
    };

    const closeDialog = () => {
        setIsModalOpen(false);
        setSelectedLending(null);
        setFormData(null);
    };

    const filteredLendings = lendings.filter((l) =>
        l.readerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.bookId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50"
            >
                <div className="bg-white p-8 rounded-xl shadow-xl border border-blue-200">
                    <PulseLoader color="#3B82F6" size={15} />
                    <p className="text-blue-600 mt-4 text-center font-medium">Loading lendings...</p>
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
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-xl shadow-md border border-blue-200 p-6"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                </svg>
                                Manage Lendings
                            </h1>
                            <p className="text-blue-500 mt-2">Track and manage all book lending activities</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleAddClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-300 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Lending
                        </motion.button>
                    </div>
                </motion.div>

                {/* Search Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-md border border-blue-200 p-6"
                >
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by Reader ID or Book ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                            <p className="text-blue-700 font-medium">
                                Found {filteredLendings.length} lending{filteredLendings.length !== 1 ? 's' : ''} matching "{searchQuery}"
                            </p>
                        </motion.div>
                    )}
                </motion.div>

                {/* Lendings Table Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden"
                >
                    <div className="p-6 bg-gradient-to-r from-blue-800 to-blue-700">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v16l7-3 7 3V6a2 2 0 00-2-2z" />
                            </svg>
                            Lending Records
                        </h2>
                        <p className="text-blue-200 mt-1">
                            Total: {lendings.length} | Active: {lendings.filter(l => l.status === 'active').length}
                        </p>
                    </div>

                    <div className="p-1">
                        {filteredLendings.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                                    {searchQuery ? 'No lendings found' : 'No lending records yet'}
                                </h3>
                                <p className="text-blue-500 mb-6">
                                    {searchQuery
                                        ? 'Try adjusting your search terms'
                                        : 'Start by adding your first lending record'
                                    }
                                </p>
                                {!searchQuery && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleAddClick}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                                    >
                                        Add First Lending
                                    </motion.button>
                                )}
                            </div>
                        ) : (
                            <LendingTable
                                lendings={filteredLendings}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onMarkReturned={handleMarkReturnedClick}
                            />
                        )}
                    </div>
                </motion.div>

                <Dialog
                    isOpen={isModalOpen}
                    onCancel={closeDialog}
                    onConfirm={handleDialogConfirm}
                    title={selectedLending ? "📝 Edit Lending" : "✨ Add New Lending"}
                >
                    <LendingForm
                        initialData={selectedLending}
                        onSubmit={handleAddOrUpdate}
                        onChange={setFormData}
                    />
                </Dialog>
            </div>
        </motion.div>
    );
};

export default LendingPage;