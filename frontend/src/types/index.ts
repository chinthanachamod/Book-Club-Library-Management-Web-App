/*export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'staff';
}*/
export interface User {
    id: string;
    name: string;
    email: string;
    /*role: string;*/
    role: 'admin' | 'staff' | 'reader';
}

export interface Reader {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    membershipDate: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    publisher: string;
    publicationYear: number;
    genre: string;
    description: string;
    coverImage?: string;
    totalCopies: number;
    availableCopies: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Lending {
    id: string;
    book: Book | string;
    reader: Reader | string;
    borrowedDate: string;
    dueDate: string;
    returnedDate?: string;
    status: 'borrowed' | 'returned' | 'overdue';
    createdAt?: string;
    updatedAt?: string;
}

export interface OverdueNotificationResult {
    lendingId: string;
    reader: string;
    status: 'success' | 'failed';
    error?: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'staff';
}

export interface ReaderFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface BookFormData {
    title: string;
    author: string;
    isbn: string;
    publisher: string;
    publicationYear: number;
    genre: string;
    description: string;
    coverImage?: string;
    totalCopies: number;
    availableCopies?: number;
}

export interface LendingFormData {
    bookId: string;
    readerId: string;
}