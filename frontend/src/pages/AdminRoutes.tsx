import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

const AdminRoutes = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen relative">
            {/* Sidebar for desktop */}
            <div className="hidden md:block w-64">
                <Sidebar />
            </div>

            {/* Sidebar for mobile */}
            <div className={`fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Sidebar closeSidebar={() => setSidebarOpen(false)} />
            </div>

            {/* Top Bar with Menu Button */}
            <div className="absolute top-4 left-4 md:hidden z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded bg-purple-600 text-white"
                >
                    <Menu />
                </button>
            </div>

            {/* Main content */}
            <main className="flex-1 p-4 w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminRoutes;