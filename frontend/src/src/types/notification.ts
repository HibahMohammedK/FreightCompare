export interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;

    transport_id: string | null;
    ticket_id: string | null;

    source: string | null;
    destination: string | null;
    transport_type: string | null;
}