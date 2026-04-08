import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AdminTransport,
  Carrier,
  mockAdminTransports,
  mockCarriers,
  mockSearchHistory,
  SearchHistoryEntry } from
'../utils/mockData';

interface TransportState {
  adminTransports: AdminTransport[];
  searchResults: Carrier[];
  savedRoutes: Carrier[];
  compareItems: Carrier[];
  searchHistory: SearchHistoryEntry[];
  filters: {
    type: 'all' | 'air' | 'sea';
    maxPrice: number;
    maxDuration: number;
    sortBy: 'price' | 'duration' | 'departure';
  };
  loading: boolean;
}

const initialState: TransportState = {
  adminTransports: mockAdminTransports,
  searchResults: mockCarriers,
  savedRoutes: [mockCarriers[1], mockCarriers[5]], // Pre-populate some saved routes
  compareItems: [],
  searchHistory: mockSearchHistory,
  filters: {
    type: 'all',
    maxPrice: 15000,
    maxDuration: 600,
    sortBy: 'price'
  },
  loading: false
};

const transportSlice = createSlice({
  name: 'transport',
  initialState,
  reducers: {
    addAdminTransport: (state, action: PayloadAction<AdminTransport>) => {
      state.adminTransports.unshift(action.payload);
    },
    updateAdminTransport: (state, action: PayloadAction<AdminTransport>) => {
      state.adminTransports = state.adminTransports.map((transport) =>
        transport.id === action.payload.id ? action.payload : transport
      );
    },
    deleteAdminTransport: (state, action: PayloadAction<string>) => {
      state.adminTransports = state.adminTransports.filter(
        (transport) => transport.id !== action.payload
      );
    },
    replaceAdminTransports: (
      state,
      action: PayloadAction<AdminTransport[]>
    ) => {
      state.adminTransports = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Carrier[]>) => {
      state.searchResults = action.payload;
    },
    toggleSavedRoute: (state, action: PayloadAction<Carrier>) => {
      const exists = state.savedRoutes.find((r) => r.id === action.payload.id);
      if (exists) {
        state.savedRoutes = state.savedRoutes.filter(
          (r) => r.id !== action.payload.id
        );
      } else {
        state.savedRoutes.push(action.payload);
      }
    },
    toggleCompareItem: (state, action: PayloadAction<Carrier>) => {
      const exists = state.compareItems.find((c) => c.id === action.payload.id);
      if (exists) {
        state.compareItems = state.compareItems.filter(
          (c) => c.id !== action.payload.id
        );
      } else {
        if (state.compareItems.length < 4) {
          state.compareItems.push(action.payload);
        }
      }
    },
    clearCompareItems: (state) => {
      state.compareItems = [];
    },
    setFilters: (
    state,
    action: PayloadAction<Partial<TransportState['filters']>>) =>
    {
      state.filters = { ...state.filters, ...action.payload };
    },
    addSearchHistory: (state, action: PayloadAction<SearchHistoryEntry>) => {
      state.searchHistory.unshift(action.payload);
    }
  }
});

export const {
  addAdminTransport,
  updateAdminTransport,
  deleteAdminTransport,
  replaceAdminTransports,
  setSearchResults,
  toggleSavedRoute,
  toggleCompareItem,
  clearCompareItems,
  setFilters,
  addSearchHistory
} = transportSlice.actions;
export default transportSlice.reducer;
