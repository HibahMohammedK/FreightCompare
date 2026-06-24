import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

interface ProtectedRouteProps {
  allowedRoles?: ("admin" | "staff" | "customer")[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { accessToken, user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // 🔴 No token → block immediately
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // 🔴 Role mismatch
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "staff") return <Navigate to="/staff" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;