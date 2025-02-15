// slices/bookingsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: [],
  reducers: {
    setBookings: (state, action) => {
      return action.payload;
    },
    addBooking: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { setBookings, addBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;