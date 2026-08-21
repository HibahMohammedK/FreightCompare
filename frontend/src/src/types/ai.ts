export interface AIRecommendation {
  rank?: number;
  company?: string | null;

  summary: string;

  price?: number | null;
  price_min?: number | null;
  price_max?: number | null;

  currency?: string | null;
  price_unit?: string | null;
  price_type?: string | null;

  duration?: number | null;
  duration_min_hours?: number | null;
  duration_max_hours?: number | null;

  container_type?: string | null;
  service_type?: string | null;

  departure_date?: string | null;

  booking_url?: string | null;
  source_url?: string | null;

  confidence?: "high" | "medium" | "low" | null;

  notes?: string | null;
}

export interface AISearchResponse {
  route?: {
    source: string;
    destination: string;
    transport_type: "air" | "sea";
  };

  summary?: string;

  recommendations: AIRecommendation[];
}