export interface Transport {
  id: number;
  company: string;
  transport_type: "air" | "sea";
  source: string;
  destination: string;
  price: number;
  price_unit : "shipment" | "kg" | "cbm" | "pallet" | "container";
  duration: number;
  departure_date: string;
  booking_url?: string;
  saved_id?: number;
}