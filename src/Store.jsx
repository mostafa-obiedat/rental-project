import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./Redux/wishlistSlice"; 
import authReducer from "./Redux/authSlice";
import propertiesReducer from "./Redux/propertySlice";
import bookingsReducer from "./Redux/bookingsSlice";
import analyticsReducer from "./Redux/analyticsSlice";
import formReducer from './Redux/bookingSlice';
import creditCardReducer from './Redux/creditCardSlice';



const store = configureStore({
  reducer: {
    wishlist: wishlistReducer, 
    auth: authReducer,  
    properties: propertiesReducer,
    bookings: bookingsReducer,
    analytics: analyticsReducer,
    form: formReducer,
    creditCard: creditCardReducer,


  },
});

export default store;



