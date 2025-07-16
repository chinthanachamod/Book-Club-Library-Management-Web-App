import Book, { IBook } from '../db/models/Book';
import { ApiError } from '../errors/ApiError';

class BookService {
    async createBook(bookData: Omit<IBook, 'availableQuantity'>): Promise<IBook> {
        try {
            const book = new Book(bookData);
            return await book.save();
        } catch (error) {
            throw ApiError.badRequest('Error creating book');
        }
    }

    async getAllBooks(): Promise<IBook[]> {
        return Book.find().sort({ createdAt: -1 });
    }

    async getBookById(id: string): Promise<IBook | null> {
        return Book.findById(id);
    }

    async updateBook(id: string, updateData: Partial<IBook>): Promise<IBook | null> {
        const book = await Book.findById(id);
        if (!book) {
            throw ApiError.notFound('Book not found');
        }

        // Calculate available quantity difference if quantity is updated
        if (updateData.quantity !== undefined) {
            const diff = updateData.quantity - book.quantity;
            updateData.availableQuantity = book.availableQuantity + diff;
        }

        return Book.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteBook(id: string): Promise<IBook | null> {
        const book = await Book.findById(id);
        if (!book) {
            throw ApiError.notFound('Book not found');
        }

        // Check if all copies are available before deletion
        if (book.availableQuantity !== book.quantity) {
            throw ApiError.badRequest('Cannot delete book with borrowed copies');
        }

        return Book.findByIdAndDelete(id);
    }

    async searchBooks(query: string): Promise<IBook[]> {
        return Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { isbn: { $regex: query, $options: 'i' } },
            ],
        });
    }
}

export default new BookService();