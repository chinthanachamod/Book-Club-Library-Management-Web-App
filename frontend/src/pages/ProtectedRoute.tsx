import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    // console.log("ProtectedRoute - isLoggedIn:", isLoggedIn); // 👈 add this

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
