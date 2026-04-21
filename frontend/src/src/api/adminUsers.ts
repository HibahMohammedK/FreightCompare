import API from "./axios"; // use your existing axios instance

export const getAdminUsers = (
 role?: string,
 search?: string
) => {

 return API.get("/users/admin/users/", {
   params: {
     role,
     search
   }
 });

};

export const getUsersByUrl = (url: string) => {
  return API.get(url);
};

export const createStaff = (data: {
  email: string;
  username: string;
  password: string;
}) => {
  return API.post("/users/admin/staff/create/", data);
};

export const toggleBlockUser = (userId: string) => {
  return API.patch(
    `/users/admin/users/${userId}/block/`
  );
};