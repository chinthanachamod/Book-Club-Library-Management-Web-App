import { useState } from 'react';
import type { Reader } from '../../types';

interface ReaderFormProps {
    initialData?: Reader;
    onSubmit: (reader: Omit<Reader, 'id'>) => void;
    onCancel: () => void;
}

export const ReaderForm = ({ initialData, onSubmit, onCancel }: ReaderFormProps) => {
    const [reader, setReader] = useState<Omit<Reader, 'id'>>(
        initialData || {
            name: '',
            email: '',
            phone: '',
            address: '',
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReader(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(reader);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    {initialData ? 'Edit Reader' : 'Add New Reader'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    {initialData ? 'Update reader information' : 'Enter new reader details'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={reader.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border bg-gray-50 focus:bg-white transition-colors"
                        placeholder="Enter full name"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={reader.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border bg-gray-50 focus:bg-white transition-colors"
                        placeholder="Enter email address"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={reader.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border bg-gray-50 focus:bg-white transition-colors"
                        placeholder="Enter phone number"
                        required
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={reader.address}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border bg-gray-50 focus:bg-white transition-colors"
                        placeholder="Add your address"
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex justify-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-150"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="inline-flex justify-center rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-150"
                >
                    {initialData ? 'Update Reader' : 'Add Reader'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </form>
    );
};