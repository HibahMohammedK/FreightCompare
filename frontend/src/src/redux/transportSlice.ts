import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Transport } from "../types/transport";
import type { SearchHistory } from "../types/searchHistory";

interface TransportState {
  searchResults: Transport[];
  compareItems: Transport[];
  searchHistory: SearchHistory[];
  savedRoutes: Transport[];

  filters: {
    type: "all" | "air" | "sea";
    maxPrice: number;
    maxDuration: number;
    sortBy: "price" | "duration" | "departure";
  };

  loading: boolean;
}

const initialState: TransportState = {
  searchResults: [],
  compareItems: [],
  searchHistory: [],
  savedRoutes: [],

  filters: {
    type: "all",
    maxPrice: 15000,
    maxDuration: 600,
    sortBy: "price",
  },

  loading: false,
};

const transportSlice = createSlice({
  name: "transport",
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<Transport[]>) => {
      state.searchResults = action.payload;
    },

    toggleCompareItem: (state, action: PayloadAction<Transport>) => {
      const exists = state.compareItems.find(
        (item) => item.id === action.payload.id
      );

      if (exists) {
        state.compareItems = state.compareItems.filter(
          (item) => item.id !== action.payload.id
        );
      } else if (state.compareItems.length < 4) {
        state.compareItems.push(action.payload);
      }
    },

    clearCompareItems: (state) => {
      state.compareItems = [];
    },

    setSearchHistory: (state, action: PayloadAction<SearchHistory[]>) => {
      state.searchHistory = action.payload;
    },

    removeSearchHistory: (state, action: PayloadAction<number>) => {
      state.searchHistory = state.searchHistory.filter(
        (item) => item.id !== action.payload
      );
    },

    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },

    setSavedRoutes: (state, action: PayloadAction<Transport[]>) => {
      state.savedRoutes = action.payload;
    },

    addSavedRoute: (state, action: PayloadAction<Transport>) => {
      state.savedRoutes.push(action.payload);
    },

    removeSavedRoute: (state, action: PayloadAction<number>) => {
      state.savedRoutes = state.savedRoutes.filter(
        (route) => route.id !== action.payload
      );
    },

    clearSavedRoutes: (state)=>{
      state.savedRoutes = [];
    },

    setFilters: (state, action: PayloadAction<Partial<TransportState["filters"]>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
  },
});

export const {
  setSearchResults,
  toggleCompareItem,
  clearCompareItems,
  setSearchHistory,
  removeSearchHistory,
  clearSearchHistory,
  setSavedRoutes,
  addSavedRoute,
  removeSavedRoute,
  clearSavedRoutes,
  setFilters,
} = transportSlice.actions;

export default transportSlice.reducer;