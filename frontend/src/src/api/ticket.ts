import API from "./axios";

import {
  TicketList,
  TicketDetail,
  CreateTicketRequest,
  UpdateTicketStatusRequest,
  AssignTicketRequest,
} from "../types/ticket";

// GET all tickets
export const getTickets = () =>
  API.get<TicketList[]>("/tickets/");

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