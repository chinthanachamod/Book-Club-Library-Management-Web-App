import mongoose from 'mongoose';
import User from '../src/models/user.model';
import Reader from '../src/models/reader.model';
import Book from '../src/models/book.model';
import Lending from '../src/models/lending.model';
import * as bcrypt from 'bcryptjs';  // Changed import syntax to avoid esModuleInterop
import { config } from 'dotenv';

config();

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        await mongoose.connection.dropDatabase();

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Admin User',
            email: 'admin@bookclub.com',
            password: hashedPassword,
            role: 'admin',
        });

        // Create staff user
        const staffPassword = await bcrypt.hash('staff123', 10);
        await User.create({
            name: 'Staff User',
            email: 'staff@bookclub.com',
            password: staffPassword,
            role: 'staff',
        });

        // Create readers
        const readers = await Reader.create([
            {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '0771234567',
                address: '123 Main St, Colombo',
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '0777654321',
                address: '456 Oak Ave, Kandy',
            },
            {
                name: 'Bob Johnson',
                email: 'bob@example.com',
                phone: '0771122334',
                address: '789 Pine Rd, Galle',
            },
        ]);

        // Create books
        const books = await Book.create([
            {
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                isbn: '9780743273565',
                publisher: 'Scribner',
                publicationYear: 1925,
                genre: 'Classic',
                description: 'A story of wealth, love, and the American Dream in the 1920s.',
                totalCopies: 5,
                availableCopies: 3,
            },
            {
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                isbn: '9780061120084',
                publisher: 'J. B. Lippincott & Co.',  // Fixed typo
                publicationYear: 1960,
                genre: 'Fiction',
                description: 'A powerful story of racial injustice and moral growth in the American South.',
                totalCopies: 3,
                availableCopies: 1,
            },
            {
                title: '1984',
                author: 'George Orwell',
                isbn: '9780451524935',
                publisher: 'Secker & Warburg',  // Fixed typo
                publicationYear: 1949,
                genre: 'Dystopian',
                description: 'A dystopian novel about totalitarianism and surveillance.',
                totalCopies: 4,
                availableCopies: 4,
            },
        ]);

        // Create lendings
        await Lending.create([
            {
                book: books[0]._id,
                reader: readers[0]._id,
                borrowedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
                dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago (overdue) - simplified
                status: 'overdue',
            },
            {
                book: books[1]._id,
                reader: readers[1]._id,
                borrowedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // in 9 days
                status: 'borrowed',
            },
            {
                book: books[0]._id,
                reader: readers[2]._id,
                borrowedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
                dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago (overdue)
                returnedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // returned 3 days ago
                status: 'returned',
            },
        ]);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Handle the promise properly
seedDatabase().catch(error => {
    console.error('Unhandled error in seedDatabase:', error);
    process.exit(1);
});