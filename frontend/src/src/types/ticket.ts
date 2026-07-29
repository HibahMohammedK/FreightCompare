export type TicketCategory =
  | "transport"
  | "subscription"
  | "payment"
  | "technical"
  | "ai"
  | "company"
  | "general";

export type TicketPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export type TicketStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "waiting_customer"
  | "resolved"
  | "closed";

/**
 * Used when creating a ticket
 * Matches TicketCreateSerializer
 */
export interface CreateTicketRequest {
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}

/**
 * Matches TicketListSerializer
 */
export interface TicketList {
  id: string;
  ticket_number: string;

  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;

  customer_name: string;
  customer_email: string;

  assigned_staff_name: string | null;
  assigned_staff_email: string | null;

  created_at: string;
}

/**
 * Matches TicketDetailSerializer
 */
export interface TicketDetail {
  id: string;
  ticket_number: string;

  subject: string;
  description: string;

  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;

  customer: string;
  customer_name: string;
  customer_email: string;

  assigned_staff: string | null;
  assigned_staff_name: string | null;
  assigned_staff_email: string | null;

  created_at: string;
  updated_at: string;

  assigned_at: string | null;
  resolved_at: string | null;
  closed_at: string | null;
}

/**
 * Matches TicketStatusSerializer
 */
export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}

/**
 * Matches TicketAssignSerializer
 */
export interface AssignTicketRequest {
  assigned_staff: string;
}