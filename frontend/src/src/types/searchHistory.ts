export interface SearchHistory {
  id: number;
  source: string;
  destination: string;
  transport_type: "all" | "air" | "sea";
  searched_at: string;
}