import { useEffect, useState } from "react";
import type { Book } from "../types/Book";
import BooksTable from "../components/tables/BooksTable";
import BookForm from "../components/forms/BookForm";
import Dialog from "../components/Dialog";
import { addBook, fetchAllBooks, removeBook, updateBook } from "../services/BookService.ts";
import axios from "axios";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { motion } from "framer-motion";

const BooksPage = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Book | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const getBook = async () => {
        try {
            setIsLoading(true);
            const result = await fetchAllBooks();
            setBooks(result);
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
        getBook();
    }, []);

    const handleAddOrUpdate = async (book: Book) => {
        try {
            setIsLoading(true);
            if (book._id) {
                const updatedBook = await updateBook(book._id, {
                    title: book.title,
                    author: book.author,
                    isbn: book.isbn,
                    available: book.available,
                    qty: book.qty,
                });
                setBooks((prev) => prev.map((b) => (b._id === updatedBook._id ? updatedBook : b)));
                toast.success("Book updated successfully.");
            } else {
                const newBook = await addBook({
                    title: book.title,
                    author: book.author,
                    isbn: book.isbn,
                    available: book.available,
                    qty: 0,
                });
                setBooks((prev) => [...prev, newBook]);
                toast.success("Book added successfully.");
            }
            setSelectedBook(null);
            setIsModalOpen(false);
            setFormData(null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message);
            } else {
                toast.error("Something went wrong while saving book.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this book?")) return;
        try {
            setIsLoading(true);
            await removeBook(id);
            setBooks((prev) => prev.filter((b) => b._id !== id));
            toast.success("Book deleted successfully");
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

    const handleEdit = (book: Book) => {
        setSelectedBook(book);
        setFormData(book);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedBook(null);
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

    const filteredBooks = books.filter((book) =>
        [book.title, book.author, book.isbn]
            .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-white p-8 rounded-xl shadow-2xl border border-blue-100"
                    >
                        <PulseLoader color="#3B82F6" size={15} />
                        <p className="text-blue-600 mt-4 text-center font-medium">Loading books...</p>
                    </motion.div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="min-h-screen bg-gradient-to-b from-blue-50 to-white"
            >
                <div className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-8"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    Book Management
                                </h1>
                                <p className="text-blue-500 mt-2">Manage your library collection</p>
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
                                Add Book
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Search Section */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by title, author, or ISBN..."
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
                                className="mt-4 text-blue-600"
                            >
                                Found {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} matching "{searchQuery}"
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Books Table Section */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden"
                    >
                        <div className="p-4 bg-blue-700 text-white">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                                </svg>
                                Library Collection
                            </h2>
                            <div className="text-blue-100 text-sm mt-1">
                                Total: {books.length} books | Available: {books.filter(b => b.available).length}
                            </div>
                        </div>

                        <div className="p-4">
                            {filteredBooks.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="mx-auto mb-6 text-blue-400">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-blue-800 mb-2">
                                        {searchQuery ? 'No books found' : 'Your library is empty'}
                                    </h3>
                                    <p className="text-blue-500 mb-4">
                                        {searchQuery ? 'Try different search terms' : 'Add your first book to get started'}
                                    </p>
                                    {!searchQuery && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleAddClick}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow transition-all duration-300"
                                        >
                                            Add First Book
                                        </motion.button>
                                    )}
                                </motion.div>
                            ) : (
                                <BooksTable books={filteredBooks} onEdit={handleEdit} onDelete={handleDelete} />
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
                        title={selectedBook ? "Edit Book" : "Add New Book"}
                    >
                        <BookForm
                            initialData={selectedBook}
                            onSubmit={handleAddOrUpdate}
                            onChange={setFormData}
                        />
                    </Dialog>
                </div>
            </motion.div>
        </>
    );
};

export default BooksPage;