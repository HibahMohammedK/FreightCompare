import API from "./axios";

export const getDashboardMetrics = () => {
  return API.get(
    "/users/admin/dashboard/"
  );
};