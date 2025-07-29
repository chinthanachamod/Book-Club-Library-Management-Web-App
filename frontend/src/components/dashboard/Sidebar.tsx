import { NavLink } from 'react-router-dom';
import {useAuth} from "../../context/AuthContext.tsx";


export const Sidebar = () => {
    const { user, logout } = useAuth();

    return (
        <div className="w-64 h-full bg-gradient-to-b from-indigo-900 to-indigo-800 shadow-xl flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-indigo-700">
                <h1 className="text-2xl font-bold text-white">Book Club Library</h1>
                <p className="text-sm text-indigo-200 mt-1">Management Portal</p>
                {user && (
                    <div className="mt-4 pt-4 border-t border-indigo-700">
                        <p className="text-indigo-100 text-sm">Logged in as:</p>
                        <p className="text-white font-medium truncate">{user.name}</p>
                        <p className="text-indigo-200 text-xs truncate">{user.email}</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    <li>
                        <NavLink
                            to="/books"
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-indigo-700 text-white font-medium shadow-md'
                                    : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`
                            }
                        >
                            <span className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Books
                            </span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/readers"
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-indigo-700 text-white font-medium shadow-md'
                                    : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`
                            }
                        >
                            <span className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Readers
                            </span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/lendings"
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-indigo-700 text-white font-medium shadow-md'
                                    : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`
                            }
                        >
                            <span className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                Lendings
                            </span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/overdue"
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-rose-600 text-white font-medium shadow-md'
                                    : 'text-indigo-100 hover:bg-rose-500 hover:text-white'}`
                            }
                        >
                            <span className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Overdue
                            </span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* Footer with Logout */}
            <div className="p-4 border-t border-indigo-700">
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm text-indigo-100 hover:text-white hover:bg-indigo-600 rounded-lg transition-all"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                </button>
                <div className="flex justify-between items-center mt-3 text-xs text-indigo-300">
                    <span>v1.2.0</span>
                    <span>© {new Date().getFullYear()} Book Club</span>
                </div>
            </div>
        </div>
    );
};