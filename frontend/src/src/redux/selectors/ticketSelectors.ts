import { RootState } from '../store';

export const selectTickets = (state: RootState) => state.ticket.tickets;

export const selectActiveTicket = (state: RootState) => {
  const { tickets, activeTicketId } = state.ticket;
  return tickets.find(t => t.id === activeTicketId) || null;
};

export const selectFilteredTickets = (state: RootState) => {
  const { tickets, filter } = state.ticket;

  return tickets.filter(t => {
    const statusMatch =
      filter.status === 'all' || t.status === filter.status;

    const priorityMatch =
      filter.priority === 'all' || t.priority === filter.priority;

    return statusMatch && priorityMatch;
  });
};