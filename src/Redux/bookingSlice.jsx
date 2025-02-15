import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  streetAddress: "",
  streetAddressLine2: "",
  city: "",
  bookingDate: "",
  bookingTime: "",
  numberOfPeople: "",
  agreeTerms: false,
  signature: "",
  approval:false,
  status: "pending",
 
};

const bookingSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

  },
});

export const { updateField, submitForm } = bookingSlice.actions;
export default bookingSlice.reducer;