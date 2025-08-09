import { useState } from "react";
import {
    Book, Users, CalendarCheck, AlarmClock,
    LayoutDashboard, Menu, ChevronLeft, LogOut, X
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface SidebarProps {
    closeSidebar?: () => void;
}

const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Readers", icon: <Users size={20} />, path: "/readers" },
    { name: "Books", icon: <Book size={20} />, path: "/books" },
    { name: "Lending", icon: <CalendarCheck size={20} />, path: "/lending" },
    { name: "Overdue", icon: <AlarmClock size={20} />, path: "/overdue" },
];

const Sidebar = ({ closeSidebar }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            // Simulate API call or cleanup
            await new Promise(resolve => setTimeout(resolve, 800));
            localStorage.removeItem("token");
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            toast.error("Logout failed. Please try again.");
        } finally {
            setIsLoggingOut(false);
            closeSidebar?.();
        }
    };

    const SidebarContent = () => (
        <>
            <div className="flex items-center justify-between p-4 border-b border-blue-200">
                {!isCollapsed && (
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg font-bold text-blue-800 hidden md:block"
                    >
                        Book-Club
                    </motion.h1>
                )}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="hidden md:block p-1 rounded-full hover:bg-blue-100"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <Menu className="text-blue-600" /> : <ChevronLeft className="text-blue-600" />}
                </motion.button>
            </div>

            <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => (
                    <motion.div
                        key={item.name}
                        onHoverStart={() => setHoveredItem(item.name)}
                        onHoverEnd={() => setHoveredItem(null)}
                        whileHover={{ scale: 1.02 }}
                        className="relative"
                    >
                        {hoveredItem === item.name && !isCollapsed && (
                            <motion.div
                                layoutId="sidebarHover"
                                className="absolute inset-0 bg-blue-100 rounded-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                        )}
                        <Link
                            to={item.path}
                            onClick={closeSidebar}
                            className={clsx(
                                "flex items-center px-3 py-3 rounded-lg transition-colors relative z-10",
                                "hover:text-blue-700",
                                location.pathname === item.path
                                    ? "bg-blue-600 text-white"
                                    : "text-blue-700 hover:bg-blue-50",
                                isCollapsed ? "justify-center" : "gap-3"
                            )}
                        >
                            <div className={clsx(
                                location.pathname === item.path ? "text-white" : "text-blue-600"
                            )}>
                                {item.icon}
                            </div>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-sm font-medium"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                        </Link>
                    </motion.div>
                ))}
            </nav>

            <div className="mt-auto px-2 pb-4">
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={clsx(
                        "flex items-center w-full px-3 py-3 rounded-lg transition-colors",
                        "bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700",
                        isCollapsed ? "justify-center" : "gap-3"
                    )}
                >
                    {isLoggingOut ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="flex items-center"
                        >
                            <LogOut className="h-5 w-5" />
                        </motion.div>
                    ) : (
                        <LogOut className="h-5 w-5" />
                    )}
                    {!isCollapsed && (
                        <span className="text-sm font-medium">
                            {isLoggingOut ? "Logging out..." : "Logout"}
                        </span>
                    )}
                </motion.button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden p-4 flex justify-between items-center bg-blue-600 text-white">
                <h2 className="text-xl font-bold">Book-Club</h2>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeSidebar}
                >
                    <X size={28} />
                </motion.button>
            </div>

            {/* Sidebar Container */}
            <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={clsx(
                    "flex flex-col h-full bg-white shadow-xl border-r border-blue-200 transition-all duration-300 ease-in-out",
                    "md:fixed md:top-0 md:left-0 md:z-30",
                    isCollapsed ? "w-16" : "w-64"
                )}
            >
                {SidebarContent()}
            </motion.div>
        </>
    );
};

export default Sidebar;