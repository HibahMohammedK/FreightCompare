export interface AIRecommendation {
  rank: number;
  company: string | null;
  price: number | null;
  currency: string | null;
  price_unit: string | null;
  duration: number | null;
  departure_date: string | null;
  booking_url: string | null;
  summary: string;
  confidence: "high" | "medium" | "low";
  notes: string;
}

export interface AITransportResponse {
  recommendations: AIRecommendation[];
}