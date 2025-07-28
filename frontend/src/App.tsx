import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Readers from './pages/Readers';
import Books from './pages/Books';
import Lendings from './pages/Lendings';
import Overdue from './pages/Overdue';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="readers" element={<Readers />} />
                    <Route path="books" element={<Books />} />
                    <Route path="lendings" element={<Lendings />} />
                    <Route path="overdue" element={<Overdue />} />
                    <Route
                        path="admin"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <Admin />
                            </ProtectedRoute>
                        }
                    />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;