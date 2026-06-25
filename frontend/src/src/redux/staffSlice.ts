import {
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";

interface StaffUser {
  id: string;
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  status: string;
  is_active: boolean;
}

interface StaffState {
  staff: StaffUser[];
  loading: boolean;
}

const initialState: StaffState = {
  staff: [],
  loading: false
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {

    setStaff: (
      state,
      action: PayloadAction<StaffUser[]>
    ) => {
      state.staff = action.payload;
    },

    addStaff: (
      state,
      action: PayloadAction<StaffUser>
    ) => {
      state.staff.unshift(
        action.payload
      );
    },

    updateStaffStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: string;
      }>
    ) => {

      const staffMember =
        state.staff.find(
          s => s.id === action.payload.id
        );

      if (staffMember) {
        staffMember.status =
          action.payload.status;
      }
    },

    toggleStaffBlocked: (
      state,
      action: PayloadAction<string>
    ) => {

      const staffMember =
        state.staff.find(
          s => s.id === action.payload
        );

      if (staffMember) {
        staffMember.is_active =
          !staffMember.is_active;
      }
    },

    setLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.loading =
        action.payload;
    }
  }
});

export const {
  setStaff,
  addStaff,
  updateStaffStatus,
  toggleStaffBlocked,
  setLoading
} = staffSlice.actions;

export default staffSlice.reducer;