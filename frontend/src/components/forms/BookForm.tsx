import { useState, useEffect } from "react";
import type { Book } from "../../types/Book";

interface BookFormProps {
    onSubmit: (book: Book) => void;
    initialData?: Book | null;
    onChange?: (book: Book) => void;
    onCancel?: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, initialData, onChange, onCancel }) => {
    const [formData, setFormData] = useState<Book>({
        _id: "",
        qty: 0,
        title: "",
        author: "",
        isbn: "",
        available: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            onChange?.(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value, type } = target;
        const checked = (type === "checkbox") ? (target as HTMLInputElement).checked : undefined;

        const updatedData = {
            ...formData,
            [name]: type === "checkbox"
                ? checked
                : type === "number"
                    ? parseInt(value) || 0
                    : value,
        };

        setFormData(updatedData);
        onChange?.(updatedData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        if (!initialData) {
            setFormData({ _id: "", qty: 0, title: "", author: "", isbn: "", available: true });
            onChange?.({ _id: "", qty: 0, title: "", author: "", isbn: "", available: true });
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold text-blue-700 mb-6">
                {initialData ? "Edit Book" : "Add New Book"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Book Title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                        Author *
                    </label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Author Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                        ISBN *
                    </label>
                    <input
                        type="text"
                        id="isbn"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                        placeholder="ISBN Number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                    </label>
                    <input
                        type="number"
                        id="qty"
                        name="qty"
                        min="0"
                        value={formData.qty}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="available"
                        name="available"
                        checked={formData.available}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
                    />
                    <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                        Available for lending
                    </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {initialData ? "Update Book" : "Add Book"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookForm;