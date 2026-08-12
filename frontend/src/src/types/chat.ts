export interface Message {
    id: string;

    conversation: string;

    sender: string;
    sender_name: string;
    sender_email: string;

    message: string;
    attachment: string | null;

    is_read: boolean;

    created_at: string;
}

export interface ConversationList {
    id: string;

    ticket_id: string;
    ticket_number: string;

    customer_name: string;
    staff_name: string | null;

    status: "active" | "closed";

    last_message: string | null;
    last_message_at: string | null;
    unread_count: number;

    updated_at: string;
}

export interface ConversationDetail extends ConversationList {
    customer: string;
    staff: string | null;

    messages: Message[];
    
    customer_profile_image: string | null;
    staff_profile_image: string | null;

    created_at: string;
}

export interface SendMessageRequest {
    conversation: string;
    message?: string;
    attachment?: File | null;
}