import api from "./axios";
import type { SubscriptionPlan } from "../types/subscription";

export const getCurrentSubscription = () => {
  return api.get("/subscription/me/");
};

export const getSubscriptionPlans = () => {
  return api.get<SubscriptionPlan[]>("/subscription/plans/");
};

export const createCheckoutSession = (planId: number) => {
  return api.post("/subscription/create-checkout-session/", {
    plan_id: planId,
  });
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

export const getSubscriptionHistory = () => {
  return api.get("/subscription/history/");
};