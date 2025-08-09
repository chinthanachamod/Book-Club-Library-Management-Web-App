/*import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import AdminRoutes from "./pages/AdminRoutes.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ReadersPage from "./pages/ReadersPage.tsx";
import BooksPage from "./pages/BooksPage.tsx";
import LendingPage from "./pages/LendingPage.tsx";
import OverduePage from "./pages/OverduePage.tsx";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import {createBrowserRouter} from "react-router-dom";

const router = createBrowserRouter([
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignupPage /> },

    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                element: <AdminRoutes />,
                children: [
                    { path: "dashboard", element: <Dashboard /> },
                    { path: "readers", element: <ReadersPage /> },
                    { path: "books", element: <BooksPage /> },
                    { path: "lending", element: <LendingPage /> },
                    { path: "overdue", element: <OverduePage /> },
                ],
            },
        ],
    },
]);

export default router;*/
import AdminRoutes from "./pages/AdminRoutes.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ReadersPage from "./pages/ReadersPage.tsx";
import BooksPage from "./pages/BooksPage.tsx";
import LendingPage from "./pages/LendingPage.tsx";
import OverduePage from "./pages/OverduePage.tsx";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AdminRoutes />,
        children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "readers", element: <ReadersPage /> },
            { path: "books", element: <BooksPage /> },
            { path: "lending", element: <LendingPage /> },
            { path: "overdue", element: <OverduePage /> },
        ],
    },
]);

export default router;
