import API from "./axios";

export const getNotifications = () =>
    API.get("/notifications/");

export const markNotificationRead = (id: string) =>
    API.patch(`/notifications/${id}/read/`);

export const markAllNotificationsRead = () =>
    API.patch("/notifications/read-all/");

export const deleteNotification = (id: string) =>
    API.delete(`/notifications/${id}/`);

export const clearNotifications = () =>
    API.delete("/notifications/clear/");
