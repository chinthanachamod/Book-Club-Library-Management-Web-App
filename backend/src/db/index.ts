// Create database connection
import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not defined in environment variables');
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`Error connecting to MongoDB: ${error}`);
        throw error;
    }
};

export default connectDB;