import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ticket, TicketMessage, mockTickets } from '../utils/mockData';

type Role = 'user' | 'staff' | 'admin';

interface TicketState {
  tickets: Ticket[];
  activeTicketId: string | null; // ✅ better than storing full object
  loading: boolean;
  filter: {
    status: string;
    priority: string;
  };
}

const initialState: TicketState = {
  tickets: mockTickets,
  activeTicketId: null,
  loading: false,
  filter: {
    status: 'all',
    priority: 'all'
  }
};

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
    },

    setActiveTicket: (state, action: PayloadAction<string | null>) => {
      state.activeTicketId = action.payload;
    },

    createTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets.unshift(action.payload);
      state.activeTicketId = action.payload.id;
    },

    updateTicketStatus: (
      state,
      action: PayloadAction<{ id: string; status: Ticket['status'] }>
    ) => {
      const ticket = state.tickets.find(t => t.id === action.payload.id);
      if (!ticket) return;

      ticket.status = action.payload.status;
      ticket.updatedAt = new Date().toISOString();
    },

    // 🔥 IMPORTANT: Role-based message control
    addTicketMessage: (
      state,
      action: PayloadAction<{
        ticketId: string;
        message: TicketMessage;
        role: Role;
      }>
    ) => {
      const { ticketId, message, role } = action.payload;

      // ❌ Admin cannot send messages
      if (role === 'admin') return;

      const ticket = state.tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      ticket.messages.push(message);
      ticket.updatedAt = new Date().toISOString();

      // 🔥 Auto lifecycle update
      if (role === 'staff' && ticket.status === 'open') {
        ticket.status = 'in-progress';
      }
    },

    assignTicket: (
      state,
      action: PayloadAction<{ ticketId: string; staffId: string }>
    ) => {
      const ticket = state.tickets.find(t => t.id === action.payload.ticketId);
      if (!ticket) return;

      ticket.assignedTo = action.payload.staffId;
      ticket.updatedAt = new Date().toISOString();
    },

    closeTicket: (state, action: PayloadAction<string>) => {
      const ticket = state.tickets.find(t => t.id === action.payload);
      if (!ticket) return;

      ticket.status = 'closed';
      ticket.updatedAt = new Date().toISOString();
    },

    setTicketFilter: (
      state,
      action: PayloadAction<Partial<TicketState['filter']>>
    ) => {
      state.filter = { ...state.filter, ...action.payload };
    }
  }
});

export const {
  setTickets,
  setActiveTicket,
  createTicket,
  updateTicketStatus,
  addTicketMessage,
  setTicketFilter,
  assignTicket,
  closeTicket
} = ticketSlice.actions;

export default ticketSlice.reducer;