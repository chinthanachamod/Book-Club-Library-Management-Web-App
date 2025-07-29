import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    {children}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};