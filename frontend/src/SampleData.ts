
// 👤 Users
import type {User} from "./types/User.ts";
import type {Book} from "./types/Book.ts";
import type {Reader} from "./types/Reader.ts";
import type {LendingData} from "./types/Lending.ts";

export const usersData: User[] = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: "$2b$10$sT.7pEjL8xzWoxO06qOwXuz5S4HjzDiBCJgyfRwY2lXv6A6Nl3a5S", // "admin123"
    }
];

// 📚 Books
export const booksData: Book[] = [
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "9780132350884",
        available: true,
        qty: 3,
    },
    {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        isbn: "9780201616224",
        available: true,
        qty: 2,
    },
    {
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        isbn: "9780596517748",
        available: false,
        qty: 0,
    }
];

// 🧑‍🎓 Readers
export const readersData: Reader[] = [
    {
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "0771234567"
    },
    {
        name: "Bob Smith",
        email: "bob@example.com",
        phone: "0787654321"
    },
    {
        name: "Charlie Brown",
        email: "charlie@example.com",
        phone: "0759988776"
    }
];

// 📖 Lendings
export const lendingsData: LendingData[] = [
    {
        readerId: "R001",
        bookId: "B001",
        lendDate: "2025-07-20",
        dueDate: "2025-07-27",
        status: "lent"
    },
    {
        readerId: "R002",
        bookId: "B002",
        lendDate: "2025-07-10",
        dueDate: "2025-07-17",
        status: "overdue"
    },
    {
        readerId: "R003",
        bookId: "B001",
        lendDate: "2025-07-01",
        dueDate: "2025-07-08",
        returnDate: "2025-07-09",
        status: "returned"
    }
];