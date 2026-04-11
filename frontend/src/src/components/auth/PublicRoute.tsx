import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

const PublicRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;