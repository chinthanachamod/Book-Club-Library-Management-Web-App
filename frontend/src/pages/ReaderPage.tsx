import { useState, useEffect } from 'react';
import { ReaderForm } from '../components/forms/ReaderForm';
import { ReaderTable } from '../components/tables/ReaderTable';
import { useAppContext } from '../context/BookContext';
import { getReaders, addReader, updateReader, deleteReader } from '../services/ReaderService';
import type {Reader} from "../types";

export const ReaderPage = () => {
    const { readers, setReaders } = useAppContext();
    const [showForm, setShowForm] = useState(false);
    const [currentReader, setCurrentReader] = useState<Reader | null>(null);

    const loadReaders = async () => {
        try {
            const data = await getReaders();
            setReaders(data);
        } catch (error) {
            console.error("Failed to load readers:", error);
        }
    };

    useEffect(() => {
        loadReaders().catch(error => {
            console.error("Failed to load readers:", error);
        });
    }, []);

    const handleAdd = async (reader: Omit<Reader, 'id'>) => {
        try {
            await addReader(reader);
            await loadReaders();
            setShowForm(false);
        } catch (error) {
            console.error("Failed to add reader:", error);
        }
    };

    const handleUpdate = async (reader: Omit<Reader, 'id'>) => {
        try {
            if (!currentReader) return;
            await updateReader(currentReader.id, reader);
            await loadReaders();
            setCurrentReader(null);
            setShowForm(false);
        } catch (error) {
            console.error("Failed to update reader:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteReader(id);
            await loadReaders();
        } catch (error) {
            console.error("Failed to delete reader:", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Reader Management</h1>
                <button
                    onClick={() => {
                        setCurrentReader(null);
                        setShowForm(true);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Add New Reader
                </button>
            </div>

            {showForm ? (
                <ReaderForm
                    initialData={currentReader || undefined}
                    onSubmit={currentReader ? handleUpdate : handleAdd}
                    onCancel={() => {
                        setShowForm(false);
                        setCurrentReader(null);
                    }}
                />
            ) : (
                <ReaderTable
                    readers={readers}
                    onEdit={(reader) => {
                        setCurrentReader(reader);
                        setShowForm(true);
                    }}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};