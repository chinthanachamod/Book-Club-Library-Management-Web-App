import { useState, useEffect } from 'react';
import { LendingForm } from '../components/forms/LendingForm';
import { LendingTable } from '../components/tables/LendingTable';
import { useAppContext } from '../context/BookContext';
import { getLendings, addLending, updateLending, deleteLending, returnBook } from '../services/LendingService';
import type {Lending} from "../types";

export const LendingPage = () => {
    const { lendings, books, readers, setLendings } = useAppContext();
    const [showForm, setShowForm] = useState(false);
    const [currentLending, setCurrentLending] = useState<Lending | null>(null);

    const loadLendings = async () => {
        try {
            const data = await getLendings();
            setLendings(data);
        } catch (error) {
            console.error("Failed to load lendings:", error);
        }
    };

    useEffect(() => {
        loadLendings().catch(error => {
            console.error("Failed to load lendings:", error);
        });
    }, []);

    const handleAdd = async (lending: Omit<Lending, 'id'>) => {
        try {
            await addLending(lending);
            await loadLendings();
            setShowForm(false);
        } catch (error) {
            console.error("Failed to add lending:", error);
        }
    };

    const handleUpdate = async (lending: Omit<Lending, 'id'>) => {
        try {
            if (!currentLending) return;
            await updateLending(currentLending.id, lending);
            await loadLendings();
            setCurrentLending(null);
            setShowForm(false);
        } catch (error) {
            console.error("Failed to update lending:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteLending(id);
            await loadLendings();
        } catch (error) {
            console.error("Failed to delete lending:", error);
        }
    };

    const handleReturn = async (id: string) => {
        try {
            await returnBook(id);
            await loadLendings();
        } catch (error) {
            console.error("Failed to return book:", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Lending Management</h1>
                <button
                    onClick={() => {
                        setCurrentLending(null);
                        setShowForm(true);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Create New Lending
                </button>
            </div>

            {showForm ? (
                <LendingForm
                    initialData={currentLending || undefined}
                    onSubmit={currentLending ? handleUpdate : handleAdd}
                    onCancel={() => {
                        setShowForm(false);
                        setCurrentLending(null);
                    }}
                />
            ) : (
                <LendingTable
                    lendings={lendings}
                    books={books}
                    readers={readers}
                    onReturn={handleReturn}
                    onEdit={(lending) => {
                        setCurrentLending(lending);
                        setShowForm(true);
                    }}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};