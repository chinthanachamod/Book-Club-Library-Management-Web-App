import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/BookContext';
import { AuthProvider } from './context/AuthContext';
import { BookPage } from './pages/BookPage';
import { ReaderPage } from './pages/ReaderPage';
import { LendingPage } from './pages/LendingPage';
import { OverduePage } from './pages/OverduePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { Layout } from './components/dashboard/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppProvider>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />

                        {/* Protected Routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Layout children={undefined} />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<DashboardPage />} />
                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="books" element={<BookPage />} />
                            <Route path="readers" element={<ReaderPage />} />
                            <Route path="lendings" element={<LendingPage />} />
                            <Route path="overdue" element={<OverduePage />} />
                        </Route>

                        {/* Redirect to dashboard for unknown routes */}
                        <Route path="*" element={
                            <ProtectedRoute>
                                <Layout>
                                    <DashboardPage />
                                </Layout>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </AppProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;