import { useEffect, useState } from "react";
import type { Reader } from "../types/Reader";
import ReaderForm from "../components/forms/ReaderForm";
import ReadersTable from "../components/tables/ReadersTable";
import Dialog from "../components/Dialog";
import {
    addReader,
    fetchAllReaders,
    removeReaders,
    updateReader,
} from "../services/ReaderService.ts";
import axios from "axios";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { motion } from "framer-motion";

const ReadersPage = () => {
    const [readers, setReaders] = useState<Reader[]>([]);
    const [filteredReaders, setFilteredReaders] = useState<Reader[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedReader, setSelectedReader] = useState<Reader | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Reader | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const getReaders = async () => {
        try {
            setIsLoading(true);
            const result = await fetchAllReaders();
            setReaders(result);
            setFilteredReaders(result);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getReaders();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = readers.filter((reader) =>
            [reader.name, reader.email, reader.phone].some((field) =>
                field.toLowerCase().includes(query)
            )
        );
        setFilteredReaders(filtered);
    }, [searchQuery, readers]);

    const handleAddOrUpdate = async (reader: Reader) => {
        try {
            setIsLoading(true);
            if (reader._id) {
                const updatedReader = await updateReader(reader._id, {
                    name: reader.name,
                    email: reader.email,
                    phone: reader.phone,
                });
                setReaders((prev) =>
                    prev.map((r) => (r._id === updatedReader._id ? updatedReader : r))
                );
                toast.success("Reader updated successfully");
            } else {
                const newReader = await addReader({
                    name: reader.name,
                    email: reader.email,
                    phone: reader.phone,
                });
                setReaders((prev) => [...prev, newReader]);
                toast.success("Reader added successfully");
            }
            setSelectedReader(null);
            setIsModalOpen(false);
            setFormData(null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message);
            } else {
                toast.error("Something went wrong while saving.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this reader?")) return;
        try {
            setIsLoading(true);
            await removeReaders(id);
            setReaders((prev) => prev.filter((r) => r._id !== id));
            toast.success("Reader deleted successfully");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message);
            } else {
                toast.error("Something went wrong while deleting.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (reader: Reader) => {
        setSelectedReader(reader);
        setFormData(reader);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedReader(null);
        setFormData(null);
        setIsModalOpen(true);
    };

    const handleDialogConfirm = () => {
        if (formData) {
            handleAddOrUpdate(formData);
        } else {
            alert("Please fill in the form before confirming.");
        }
    };

    return (
        <>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50"
                >
                    <div className="bg-white p-8 rounded-xl shadow-xl border border-blue-200">
                        <PulseLoader color="#3B82F6" size={15} />
                        <p className="text-blue-600 mt-4 text-center font-medium">Loading readers...</p>
                    </div>
                </motion.div>
            )}

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
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Manage Readers
                                </h1>
                                <p className="text-blue-500 mt-2">View and manage all library members</p>
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
                                Add Reader
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
                                placeholder="Search by name, email, or phone..."
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
                                    Found {filteredReaders.length} reader{filteredReaders.length !== 1 ? 's' : ''} matching "{searchQuery}"
                                </p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Readers Table Section */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden"
                    >
                        <div className="p-6 bg-gradient-to-r from-blue-800 to-blue-700">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Library Members
                            </h2>
                            <p className="text-blue-200 mt-1">
                                Total: {readers.length} reader{readers.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="p-1">
                            {filteredReaders.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-blue-600 mb-2">
                                        {searchQuery ? 'No readers found' : 'No readers yet'}
                                    </h3>
                                    <p className="text-blue-500 mb-6">
                                        {searchQuery
                                            ? 'Try adjusting your search terms'
                                            : 'Start by adding your first library member'
                                        }
                                    </p>
                                    {!searchQuery && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleAddClick}
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                                        >
                                            Add First Reader
                                        </motion.button>
                                    )}
                                </div>
                            ) : (
                                <ReadersTable
                                    readers={filteredReaders}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )}
                        </div>
                    </motion.div>

                    <Dialog
                        isOpen={isModalOpen}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setFormData(null);
                        }}
                        onConfirm={handleDialogConfirm}
                        title={selectedReader ? "📝 Edit Reader" : "✨ Add New Reader"}
                    >
                        <ReaderForm
                            onSubmit={handleAddOrUpdate}
                            initialData={selectedReader}
                            onChange={setFormData}
                        />
                    </Dialog>
                </div>
            </motion.div>
        </>
    );
};

export default ReadersPage;