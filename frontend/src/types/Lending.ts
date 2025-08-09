export interface Lending {
    _id: string;
    readerId: string;
    bookId: string;
    lendDate: string;
    returnDate?: string;
    dueDate: string;
    status: 'lent' | 'returned' | 'overdue';
}

export interface LendingData {
    readerId: string;
    bookId: string;
    lendDate: string;
    returnDate?: string;
    dueDate: string;
    status: 'lent' | 'returned' | 'overdue';
}