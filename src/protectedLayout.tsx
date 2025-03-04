import { Navigate, Outlet } from "react-router-dom";
import { useAuthInterceptor } from "./hooks/useAuthInterceptor";


const ProtectedLayout = () => {
    useAuthInterceptor(); // Attach the interceptor inside a router context
    const authToken = localStorage.getItem("authToken");
    return authToken ? <Outlet /> : <Navigate to="/Messenger-typescript-frontend/" replace />;
};

export default ProtectedLayout;
