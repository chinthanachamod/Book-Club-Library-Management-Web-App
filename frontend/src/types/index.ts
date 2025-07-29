export interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    quantity: number;
}

export interface Reader {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface Lending {
    id: string;
    bookId: string;
    readerId: string;
    borrowedDate: string;
    dueDate: string;
    returnedDate: string | null;
}

export interface Overdue extends Lending {
    book: Book;
    reader: Reader;
    daysOverdue: number;
}