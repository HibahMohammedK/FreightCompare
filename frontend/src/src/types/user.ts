export type UserRole =
    "admin" | "staff" | "customer";

export type StaffStatus =
    | "online"
    | "busy"
    | "offline";

export interface User {
    id: string;

    email: string;
    username: string;

    first_name?: string;
    last_name?: string;

    role: UserRole;

    status: StaffStatus;

    is_verified: boolean;
    is_active: boolean;
    is_staff: boolean;

    profile_image?: string;

    isPremium?: boolean;

    created_at: string;
}

export interface StaffUser extends User {
    ticket_count: number;
    active_ticket_count: number;
    active_chat_count: number;
}