import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

interface ProtectedRouteProps {
  allowedRoles?: ("admin" | "staff" | "customer")[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role not allowed
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return <Outlet />;
};

export default ProtectedRoute;