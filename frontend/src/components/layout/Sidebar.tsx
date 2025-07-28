import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard', roles: ['admin', 'staff'] },
    { name: 'Readers', href: '/readers', icon: 'people', roles: ['admin', 'staff'] },
    { name: 'Books', href: '/books', icon: 'book', roles: ['admin', 'staff'] },
    { name: 'Lendings', href: '/lendings', icon: 'swap', roles: ['admin', 'staff'] },
    { name: 'Overdue', href: '/overdue', icon: 'warning', roles: ['admin', 'staff'] },
    { name: 'Admin', href: '/admin', icon: 'admin', roles: ['admin'] },
];

export default function Sidebar() {
    const { pathname } = useLocation();
    const { user, logout } = useAuth();

    return (
        <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64">
                <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <h1 className="text-xl font-bold text-gray-900">Book Club Library</h1>
                        </div>
                        <nav className="mt-5 flex-1 px-2 space-y-1">
                            {navigation
                                .filter((item) => item.roles.includes(user?.role || ''))
                                .map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                            pathname === item.href
                                                ? 'bg-indigo-100 text-indigo-900'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <span className="truncate">{item.name}</span>
                                    </Link>
                                ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                        <button
                            onClick={logout}
                            className="flex-shrink-0 w-full group block"
                        >
                            <div className="flex items-center">
                                <div>
                                    <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                        Sign out
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}