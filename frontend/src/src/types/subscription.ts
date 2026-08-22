export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  currency: string;
  billing_interval: "month" | "year";

  // Human-readable features
  features: string[];

  // Machine-readable usage limits
  limits: {
    price_alerts?: number;
    [key: string]: number | undefined;
  };

  sort_order: number;
  is_active: boolean;
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