import { useAuth } from '../../context/AuthContext';

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-lg font-semibold text-gray-900">Book Club Library</h1>
                <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {user?.name} ({user?.role})
          </span>
                </div>
            </div>
        </header>
    );
}