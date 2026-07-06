export interface PriceAlert {
    id: number;
    transport: number | null;
    source: string;
    destination: string;
    departure_date: string;
    transport_type: "air" | "sea";
    target_price: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}