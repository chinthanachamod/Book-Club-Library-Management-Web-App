import app from './app';
import connectDB from './db/index';

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            if (process.env.NODE_ENV !== 'production') {
                console.log(`http://localhost:${PORT}`);
            }
        });
    })
    .catch((error) => {
        console.error('Database connection failed', error);
        process.exit(1);
    });