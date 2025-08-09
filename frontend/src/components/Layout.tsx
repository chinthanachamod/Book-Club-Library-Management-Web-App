import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 bg-gray-50 p-4">
                {children}
            </div>
        </div>
    );
};

export default Layout;
