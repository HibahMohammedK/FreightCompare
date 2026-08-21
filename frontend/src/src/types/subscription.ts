export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  currency: string;
  billing_interval: "month" | "year";
  features: string[];
  sort_order: number;
}

export interface SubscriptionHistory {
  id: number;
  plan_name: string;
  price: string;
  currency: string;
  billing_interval: "month" | "year";
  start_date: string;
  end_date: string | null;
  status: "active" | "cancelled" | "expired";
}