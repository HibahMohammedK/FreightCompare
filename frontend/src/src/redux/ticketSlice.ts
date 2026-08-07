import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  getTickets,
  getTicket,
  createTicket,
  updateTicketStatus,
  assignTicket,
} from "../api/ticket";

import type {
  TicketList,
  TicketDetail,
  CreateTicketRequest,
  UpdateTicketStatusRequest,
  AssignTicketRequest,
  TicketStatus,
} from "../types/ticket";

interface TicketState {
  tickets: TicketList[];
  selectedTicket: TicketDetail | null;

  loading: {
    fetchTickets: boolean;
    fetchTicket: boolean;
    createTicket: boolean;
    updateStatus: boolean;
    assignTicket: boolean;
  };

  error: string | null;
}

const initialState: TicketState = {
  tickets: [],
  selectedTicket: null,

  loading: {
    fetchTickets: false,
    fetchTicket: false,
    createTicket: false,
    updateStatus: false,
    assignTicket: false,
  },

  error: null,
};

/* ============================================================
   FETCH ALL TICKETS
============================================================ */

export const fetchTickets = createAsyncThunk<
  TicketList[],
  void,
  { rejectValue: string }
>(
  "ticket/fetchTickets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTickets();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ??
          "Failed to fetch tickets."
      );
    }
  }
);

/* ============================================================
   FETCH SINGLE TICKET
============================================================ */

export const fetchTicket = createAsyncThunk<
  TicketDetail,
  string,
  { rejectValue: string }
>(
  "ticket/fetchTicket",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getTicket(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ??
          "Failed to fetch ticket."
      );
    }
  }
);

/* ============================================================
   CREATE TICKET
============================================================ */
export interface TicketValidationErrors {
  subject?: string[];
  description?: string[];
  category?: string[];
  priority?: string[];
  detail?: string;
}

export const createNewTicket = createAsyncThunk<
  TicketList,
  CreateTicketRequest,
  { rejectValue: TicketValidationErrors }
>(
  "ticket/createTicket",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createTicket(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ?? {
          detail: "Failed to create ticket.",
        }
      );
    }
  }
);

/* ============================================================
   UPDATE STATUS
============================================================ */

export const updateTicket = createAsyncThunk<
  TicketDetail,
  {
    id: string;
    data: UpdateTicketStatusRequest;
  },
  { rejectValue: string }
>(
  "ticket/updateStatus",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response =
        await updateTicketStatus(id, data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ??
          "Failed to update ticket."
      );
    }
  }
);

/* ============================================================
   ASSIGN STAFF
============================================================ */

export const assignTicketToStaff =
  createAsyncThunk<
    TicketDetail,
    {
      id: string;
      data: AssignTicketRequest;
    },
    { rejectValue: string }
  >(
    "ticket/assignTicket",
    async (
      { id, data },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await assignTicket(id, data);

        return response.data;
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.detail ??
            "Failed to assign ticket."
        );
      }
    }
  );
  const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },

    clearTicketError: (state) => {
      state.error = null;
    },

    ticketCreated: (
        state,
        action: PayloadAction<TicketList>
    ) => {

        const exists = state.tickets.some(
            ticket => ticket.id === action.payload.id
        );

        if (!exists) {
            state.tickets.unshift(action.payload);
        }

    },
    
    ticketAssigned: (
        state,
        action: PayloadAction<TicketList>
    ) => {

        const index = state.tickets.findIndex(
            ticket => ticket.id === action.payload.id
        );

        if (index === -1) {

            state.tickets.unshift(action.payload);

        } else {

            state.tickets[index] = action.payload;

        }

    },

    ticketStatusChanged: (
        state,
        action: PayloadAction<TicketList>
    ) => {

        const index = state.tickets.findIndex(
            ticket => ticket.id === action.payload.id
        );

        if (index !== -1) {
            state.tickets[index] = action.payload;
        }

        if (
            state.selectedTicket &&
            state.selectedTicket.id === action.payload.id
        ) {
            state.selectedTicket.status = action.payload.status;

            state.selectedTicket.assigned_staff =
                action.payload.assigned_staff;

            state.selectedTicket.assigned_staff_name =
                action.payload.assigned_staff_name;

            state.selectedTicket.assigned_staff_email =
                action.payload.assigned_staff_email;
        }

    },

    ticketUpdated: (
        state,
        action: PayloadAction<TicketList>,
    ) => {

        const index = state.tickets.findIndex(
            ticket => ticket.id === action.payload.id
        );

        if (index >= 0) {

            state.tickets.splice(index, 1);

        }

        state.tickets.unshift(action.payload);

    },

  },

  extraReducers: (builder) => {
    builder

      /* ============================================================
         FETCH TICKETS
      ============================================================ */

      .addCase(fetchTickets.pending, (state) => {
        state.loading.fetchTickets = true;
        state.error = null;
      })

      .addCase(
        fetchTickets.fulfilled,
        (state, action: PayloadAction<TicketList[]>) => {
          state.loading.fetchTickets = false;
          state.tickets = action.payload;
        }
      )

      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading.fetchTickets = false;
        state.error =
          action.payload ?? "Failed to fetch tickets.";
      })

      /* ============================================================
         FETCH SINGLE TICKET
      ============================================================ */

      .addCase(fetchTicket.pending, (state) => {
        state.loading.fetchTicket = true;
        state.error = null;
      })

      .addCase(
        fetchTicket.fulfilled,
        (state, action: PayloadAction<TicketDetail>) => {
          state.loading.fetchTicket = false;
          state.selectedTicket = action.payload;
        }
      )

      .addCase(fetchTicket.rejected, (state, action) => {
        state.loading.fetchTicket = false;
        state.error =
          action.payload ?? "Failed to fetch ticket.";
      })

      /* ============================================================
          CREATE TICKET
      ============================================================ */

      .addCase(createNewTicket.pending, (state) => {
        state.loading.createTicket = true;
      })

      .addCase(
        createNewTicket.fulfilled,
        (state, action: PayloadAction<TicketList>) => {
          state.loading.createTicket = false;

          state.tickets.unshift(action.payload);

          state.selectedTicket = null;
        }
      )

      .addCase(createNewTicket.rejected, (state) => {
        state.loading.createTicket = false;
      })



      /* ============================================================
         UPDATE STATUS
      ============================================================ */

      .addCase(updateTicket.pending, (state) => {
        state.loading.updateStatus = true;
        state.error = null;
      })

      .addCase(
        updateTicket.fulfilled,
        (state, action: PayloadAction<TicketDetail>) => {
          state.loading.updateStatus = false;

          if (
            state.selectedTicket &&
            state.selectedTicket.id === action.payload.id
          ) {
            state.selectedTicket = action.payload;
          }

          const index = state.tickets.findIndex(
            (ticket) => ticket.id === action.payload.id
          );

          if (index !== -1) {
            state.tickets[index].status =
              action.payload.status;

            state.tickets[index].assigned_staff_name =
              action.payload.assigned_staff_name;

            state.tickets[index].assigned_staff_email =
              action.payload.assigned_staff_email;
          }
        }
      )

      .addCase(updateTicket.rejected, (state, action) => {
        state.loading.updateStatus = false;
        state.error =
          action.payload ??
          "Failed to update ticket status.";
      })

      /* ============================================================
         ASSIGN STAFF
      ============================================================ */

      .addCase(assignTicketToStaff.pending, (state) => {
        state.loading.assignTicket = true;
        state.error = null;
      })

      .addCase(
        assignTicketToStaff.fulfilled,
        (state, action: PayloadAction<TicketDetail>) => {
          state.loading.assignTicket = false;

          if (
            state.selectedTicket &&
            state.selectedTicket.id === action.payload.id
          ) {
            state.selectedTicket = action.payload;
          }

          const index = state.tickets.findIndex(
            (ticket) => ticket.id === action.payload.id
          );

          if (index !== -1) {
            state.tickets[index].status =
              action.payload.status;

            state.tickets[index].assigned_staff_name =
              action.payload.assigned_staff_name;

            state.tickets[index].assigned_staff_email =
              action.payload.assigned_staff_email;
          }
        }
      )

      .addCase(assignTicketToStaff.rejected, (state, action) => {
        state.loading.assignTicket = false;
        state.error =
          action.payload ??
          "Failed to assign ticket.";
      });
  },
});

export const {
  clearSelectedTicket,
  clearTicketError,
  ticketCreated,
  ticketAssigned,
  ticketStatusChanged,
  ticketUpdated,
} = ticketSlice.actions;

export default ticketSlice.reducer;