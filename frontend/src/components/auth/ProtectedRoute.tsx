import type {ReactNode} from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    roles?: string[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}


/*
- Redirects unauthenticated users to /login
- Redirects unauthorized roles to /dashboard
- Shows loading indicator while auth is initializing
- Supports optional role-based access control
*/
