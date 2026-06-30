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