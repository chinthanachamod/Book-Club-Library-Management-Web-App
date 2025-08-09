import React, { useState, useEffect, useRef } from "react";
import { fetchBookIds } from "../../services/BookService";
import { fetchReaderIds } from "../../services/ReaderService";
import type { Lending } from "../../types/Lending";
import {
    filterItems,
    handleDropdownKeyDown,
    handleDropdownClick,
    setupClickOutsideListener,
} from "../../util/utils.ts";

interface LendingFormProps {
    initialData?: Lending | null;
    onSubmit?: (data: Omit<Lending, "id" | "status" | "returnDate">) => void;
    onChange?: (data: Omit<Lending, "id" | "status" | "returnDate">) => void;
    onCancel?: () => void;
}

const LendingForm: React.FC<LendingFormProps> = ({ initialData, onSubmit, onChange, onCancel }) => {
    const [readerId, setReaderId] = useState("");
    const [bookId, setBookId] = useState("");
    const [lendDate, setLendDate] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [readerIds, setReaderIds] = useState<string[]>([]);
    const [bookIds, setBookIds] = useState<string[]>([]);

    const [readerDropdownVisible, setReaderDropdownVisible] = useState(false);
    const [bookDropdownVisible, setBookDropdownVisible] = useState(false);

    const [readerSelectedIndex, setReaderSelectedIndex] = useState(0);
    const [bookSelectedIndex, setBookSelectedIndex] = useState(0);

    const readerInputRef = useRef<HTMLInputElement>(null);
    const bookInputRef = useRef<HTMLInputElement>(null);

    const readerDropdownRef = useRef<HTMLDivElement>(null);
    const bookDropdownRef = useRef<HTMLDivElement>(null);

    const LOAN_PERIOD_DAYS = 14;

    const calculateDueDate = (lendDateString: string): string => {
        const date = new Date(lendDateString);
        date.setDate(date.getDate() + LOAN_PERIOD_DAYS);
        return date.toISOString().slice(0, 10);
    };

    useEffect(() => {
        fetchBookIds().then(setBookIds);
        fetchReaderIds().then(setReaderIds);
    }, []);

    const filteredReaderIds = filterItems(readerIds, readerId);
    const filteredBookIds = filterItems(bookIds, bookId);

    useEffect(() => {
        const removeReaderListener = setupClickOutsideListener(
            readerDropdownRef,
            readerInputRef,
            () => setReaderDropdownVisible(false)
        );
        const removeBookListener = setupClickOutsideListener(
            bookDropdownRef,
            bookInputRef,
            () => setBookDropdownVisible(false)
        );

        return () => {
            removeReaderListener();
            removeBookListener();
        };
    }, []);

    useEffect(() => {
        const today = new Date().toISOString().slice(0, 10);

        if (initialData) {
            setReaderId(initialData.readerId);
            setBookId(initialData.bookId);
            setLendDate(initialData.lendDate);
            setDueDate(initialData.dueDate);

            onChange?.({
                readerId: initialData.readerId,
                bookId: initialData.bookId,
                lendDate: initialData.lendDate,
                dueDate: initialData.dueDate,
                _id: "",
            });
        } else {
            const calculatedDueDate = calculateDueDate(today);
            setReaderId("");
            setBookId("");
            setLendDate(today);
            setDueDate(calculatedDueDate);

            onChange?.({
                readerId: "",
                bookId: "",
                lendDate: today,
                dueDate: calculatedDueDate,
                _id: "",
            });
        }
    }, [initialData]);

    useEffect(() => {
        if (lendDate) {
            const calculatedDueDate = calculateDueDate(lendDate);
            setDueDate(calculatedDueDate);

            onChange?.({
                readerId,
                bookId,
                lendDate,
                dueDate: calculatedDueDate,
                _id: "",
            });
        }
    }, [lendDate]);

    useEffect(() => {
        onChange?.({
            readerId,
            bookId,
            lendDate,
            dueDate,
            _id: "",
        });
    }, [readerId, bookId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!readerId || !bookId || !lendDate || !dueDate) {
            alert("Please fill in all fields.");
            return;
        }

        onSubmit?.({
            readerId,
            bookId,
            lendDate,
            dueDate,
            _id: "",
        });
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold text-blue-700 mb-6">
                {initialData ? "Edit Lending" : "Create New Lending"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Reader ID Input */}
                <div className="relative" ref={readerDropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reader ID</label>
                    <input
                        type="text"
                        value={readerId}
                        onChange={(e) => {
                            setReaderId(e.target.value);
                            setReaderDropdownVisible(true);
                            setReaderSelectedIndex(0);
                        }}
                        onKeyDown={(e) =>
                            handleDropdownKeyDown(e, {
                                visible: readerDropdownVisible,
                                setVisible: setReaderDropdownVisible,
                                filteredItems: filteredReaderIds,
                                selectedIndex: readerSelectedIndex,
                                setSelectedIndex: setReaderSelectedIndex,
                                setInputValue: setReaderId,
                                inputRef: readerInputRef,
                            })
                        }
                        onClick={() => setReaderDropdownVisible(true)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter Reader ID"
                        required
                        ref={readerInputRef}
                        autoComplete="off"
                    />
                    {readerDropdownVisible && filteredReaderIds.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredReaderIds.map((id, index) => (
                                <div
                                    key={id}
                                    onClick={() =>
                                        handleDropdownClick(id, {
                                            setInputValue: setReaderId,
                                            setVisible: setReaderDropdownVisible,
                                            inputRef: readerInputRef,
                                        })
                                    }
                                    className={`px-3 py-2 cursor-pointer transition-colors ${
                                        index === readerSelectedIndex
                                            ? "bg-blue-100 text-blue-800"
                                            : "hover:bg-gray-100"
                                    }`}
                                >
                                    {id}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Book ID Input */}
                <div className="relative" ref={bookDropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Book ID</label>
                    <input
                        type="text"
                        value={bookId}
                        onChange={(e) => {
                            setBookId(e.target.value);
                            setBookDropdownVisible(true);
                            setBookSelectedIndex(0);
                        }}
                        onKeyDown={(e) =>
                            handleDropdownKeyDown(e, {
                                visible: bookDropdownVisible,
                                setVisible: setBookDropdownVisible,
                                filteredItems: filteredBookIds,
                                selectedIndex: bookSelectedIndex,
                                setSelectedIndex: setBookSelectedIndex,
                                setInputValue: setBookId,
                                inputRef: bookInputRef,
                            })
                        }
                        onClick={() => setBookDropdownVisible(true)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter Book ID"
                        required
                        ref={bookInputRef}
                        autoComplete="off"
                    />
                    {bookDropdownVisible && filteredBookIds.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredBookIds.map((id, index) => (
                                <div
                                    key={id}
                                    onClick={() =>
                                        handleDropdownClick(id, {
                                            setInputValue: setBookId,
                                            setVisible: setBookDropdownVisible,
                                            inputRef: bookInputRef,
                                        })
                                    }
                                    className={`px-3 py-2 cursor-pointer transition-colors ${
                                        index === bookSelectedIndex
                                            ? "bg-blue-100 text-blue-800"
                                            : "hover:bg-gray-100"
                                    }`}
                                >
                                    {id}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Lend Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lend Date</label>
                    <input
                        type="date"
                        value={lendDate}
                        onChange={(e) => setLendDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                    />
                </div>

                {/* Due Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                        required
                    />
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
                        {initialData ? "Update Lending" : "Create Lending"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LendingForm;