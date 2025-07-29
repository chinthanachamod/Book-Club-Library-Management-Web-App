import { createContext, useContext, useState } from 'react';
import type {Book, Reader, Lending, Overdue} from '../types';

type AppContextType = {
    books: Book[];
    readers: Reader[];
    lendings: Lending[];
    overdue: Overdue[];
    setBooks: (books: Book[]) => void;
    setReaders: (readers: Reader[]) => void;
    setLendings: (lendings: Lending[]) => void;
    setOverdue: (overdue: Overdue[]) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [readers, setReaders] = useState<Reader[]>([]);
    const [lendings, setLendings] = useState<Lending[]>([]);
    const [overdue, setOverdue] = useState<Overdue[]>([]);

    return (
        <AppContext.Provider value={{
            books, readers, lendings, overdue,
            setBooks, setReaders, setLendings, setOverdue
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};