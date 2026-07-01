import api from "./axios";

export const getCurrentSubscription = () => {
  return api.get("/subscription/me/");
};

export const createCheckoutSession = () => {
  return api.post("/subscription/create-checkout-session/");
};

export const cancelSubscription = () => {
  return api.post("/subscription/cancel/");
};

interface AdminSubscriptionParams {
  search?: string;
  plan?: string;
  status?: string;
  page?: number;
}

export const getAdminSubscriptions = (
  params?: AdminSubscriptionParams
) => {

  return api.get(
    "/subscription/admin/subscriptions/",
    {
      params,
    }
  );

};

export const getAdminSubscriptionsByUrl = (
  url: string
) => {

  return api.get(url);

};