import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

interface ProtectedRouteProps {
  allowedRoles?: ("admin" | "staff" | "customer")[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "staff") return <Navigate to="/staff" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;