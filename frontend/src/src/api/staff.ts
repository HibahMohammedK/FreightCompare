import API from "./axios";

export const getStaff = (
  search?: string,
  status?: string
) => {

  return API.get(
    "/users/admin/staff/",
    {
      params: {
        search,
        status
      }
    }
  );

};

export const getStaffByUrl = (
  url: string
) => {

  return API.get(url);

};

export const createStaff = (data: {
  email: string;
  username: string;
  password: string;
}) => {

  return API.post(
    "/users/admin/staff/create/",
    data
  );

};

export const toggleStaffBlock = (
  userId: string
) => {

  return API.patch(
    `/users/admin/users/${userId}/block/`
  );

};

export const updateStaffStatus = (
  userId: string,
  status: string
) => {

  return API.patch(
    `/users/admin/staff/${userId}/status/`,
    {
      status
    }
  );

};

export const updateMyStatus = (
  status: string
) => {

  return API.patch(
    "/users/staff/status/",
    {
      status
    }
  );

};