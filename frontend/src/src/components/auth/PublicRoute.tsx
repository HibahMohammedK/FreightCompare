import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

const PublicRoute = () => {
  const {
    isAuthenticated,
    user,
    loading
  } = useAppSelector((state) => state.auth);

  if (loading) {
    return null;
  }

  if (isAuthenticated && user) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "staff") {
      return <Navigate to="/staff" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;