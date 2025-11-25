import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

type UserRole = "admin" | "teacher" | "student";

interface Props {
    children?: ReactElement;
    isAuthenticated: boolean;
    role?: UserRole;          
    allowedRoles?: UserRole[];  
    publicOnly?: boolean;      
    redirect?: string;         
}

const ProtectedRoute = ({
    isAuthenticated,
    role,
    allowedRoles,
    publicOnly = false,
    children,
    redirect = "/",
}: Props) => {
    if (publicOnly) {
        if (isAuthenticated) return <Navigate to={redirect} />;
        return children ? children : <Outlet />;
    }

    if (!isAuthenticated) return <Navigate to={redirect} />;

    if (allowedRoles && !allowedRoles.includes(role!)) {
        return <Navigate to={redirect} />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
