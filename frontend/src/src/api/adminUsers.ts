import API from "./axios";

export const getAdminUsers = (
    search?: string,
    premium?: "all" | "premium" | "free"
) => {
    return API.get("/users/admin/users/", {
        params: {
            search,
            ...(premium && premium !== "all"
                ? {
                      premium:
                          premium === "premium"
                              ? "true"
                              : "false",
                  }
                : {}),
        },
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