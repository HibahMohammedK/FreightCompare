import API from "./axios";

import {
  TicketList,
  TicketDetail,
  CreateTicketRequest,
  UpdateTicketStatusRequest,
  AssignTicketRequest,
} from "../types/ticket";

// GET all tickets
export const getTickets = (
  assignedStaff?: string
) =>
  API.get<TicketList[]>("/tickets/", {
    params:
      assignedStaff && assignedStaff !== "all"
        ? {
            assigned_staff: assignedStaff,
          }
        : undefined,
  });

// GET single ticket
export const getTicket = (id: string) =>
  API.get<TicketDetail>(`/tickets/${id}/`);

// CREATE ticket
export const createTicket = (
  data: CreateTicketRequest
) =>
  API.post<TicketList>(
    "/tickets/create/",
    data
  );

// UPDATE status
export const updateTicketStatus = (
  id: string,
  data: UpdateTicketStatusRequest
) =>
  API.patch<TicketDetail>(
    `/tickets/${id}/status/`,
    data
  );

// ASSIGN staff
export const assignTicket = (
  id: string,
  data: AssignTicketRequest
) =>
  API.patch<TicketDetail>(
    `/tickets/${id}/assign/`,
    data
  );

export const reassignTickets = (
  fromStaff: string,
  toStaff: string
) =>
  API.patch("/tickets/reassign-staff/", {
    from_staff: fromStaff,
    to_staff: toStaff,
  });