import Reader, { IReader } from '../db/models/Reader';
import { ApiError } from '../errors/ApiError';

class ReaderService {
    async createReader(readerData: Omit<IReader, 'borrowedBooks'>): Promise<IReader> {
        try {
            const reader = new Reader(readerData);
            return await reader.save();
        } catch (error) {
            throw ApiError.badRequest('Error creating reader');
        }
    }

    async getAllReaders(): Promise<IReader[]> {
        return Reader.find().sort({ createdAt: -1 });
    }

    async getReaderById(id: string): Promise<IReader | null> {
        return Reader.findById(id);
    }

    async updateReader(id: string, updateData: Partial<IReader>): Promise<IReader | null> {
        const reader = await Reader.findById(id);
        if (!reader) {
            throw ApiError.notFound('Reader not found');
        }

        return Reader.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteReader(id: string): Promise<IReader | null> {
        const reader = await Reader.findById(id);
        if (!reader) {
            throw ApiError.notFound('Reader not found');
        }

        // Check if reader has borrowed books before deletion
        if (reader.borrowedBooks > 0) {
            throw ApiError.badRequest('Cannot delete reader with borrowed books');
        }

        return Reader.findByIdAndDelete(id);
    }

    async searchReaders(query: string): Promise<IReader[]> {
        return Reader.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } },
            ],
        });
    }
}

export default new ReaderService();