import { createSlice } from '@reduxjs/toolkit';

const creditCardSlice = createSlice({
  name: 'creditCard',
  initialState: {
    name: '',
    bookingDate: '',
    bookingTime: '',
    price: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    loading: false,
    error: null,
  },
  reducers: {
    updateField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { updateField, setLoading, setError } = creditCardSlice.actions;
export default creditCardSlice.reducer;