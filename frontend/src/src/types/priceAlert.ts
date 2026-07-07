export interface PriceAlert {
    id: number;
    transport: number | null;
    source: string;
    destination: string;
    departure_date: string;
    transport_type: "air" | "sea";

    target_price: number;   

    status: "active" | "triggered";

    triggered_at: string | null;
    triggered_price: number | null;

    is_active: boolean;
    created_at: string;
    updated_at: string;
}