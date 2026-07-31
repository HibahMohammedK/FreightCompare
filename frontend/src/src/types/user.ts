export type UserRole =
    "admin" | "staff" | "customer";

export interface User {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    username: string;
    role: UserRole;
    status?: "online" | "busy" | "offline";
    is_verified: boolean;
    profile_image?: string;
    is_staff: boolean;
    isPremium?: boolean;
    created_at: string;
}