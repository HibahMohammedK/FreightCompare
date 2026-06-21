import API from "./axios";

export const getAdminUsers = (
 search?: string
) => {

 return API.get("/users/admin/users/", {
   params: {
     search
   }
 });

};

export const getUsersByUrl = (url: string) => {
  return API.get(url);
};


export const toggleBlockUser = (userId: string) => {
  return API.patch(
    `/users/admin/users/${userId}/block/`
  );
};