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