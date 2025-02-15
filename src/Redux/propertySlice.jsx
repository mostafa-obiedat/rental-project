import { createSlice } from "@reduxjs/toolkit";

const propertiesSlice = createSlice({
  name: "properties",
  initialState: [],
  reducers: {
    setProperties: (state, action) => {
      return action.payload; // Replace the entire state with the new data
    },
    addProperty: (state, action) => {
      // Check if the property already exists in the state
      const existingProperty = state.find(
        (property) => property.id === action.payload.id
      );
      if (!existingProperty) {
        state.push(action.payload); // Add the property only if it doesn't exist
      }
    },
    updateProperty: (state, action) => {
      const index = state.findIndex(
        (property) => property.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteProperty: (state, action) => {
      return state.filter((property) => property.id !== action.payload);
    },
  },
});

export const { setProperties, addProperty, updateProperty, deleteProperty } =
  propertiesSlice.actions;
export default propertiesSlice.reducer;