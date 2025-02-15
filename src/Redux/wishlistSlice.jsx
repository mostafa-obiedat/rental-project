import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuth } from "firebase/auth";

const FIREBASE_URL = "https://rent-app-d50fb-default-rtdb.firebaseio.com";

// استرجاع معرف المستخدم الحالي من Firebase Auth
const getUserId = () => {
  const auth = getAuth();
  return auth.currentUser ? auth.currentUser.uid : null;
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
    },
    addFarmToWishlist: (state, action) => {
      state.wishlist.push(action.payload);
    },
    removeFarmFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter((farm) => farm.id !== action.payload);
    },
  },
});

export const { setLoading, setWishlist, addFarmToWishlist, removeFarmFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

// ✅ إضافة مزرعة إلى المفضلة
export const addToWishlist = (farm) => async (dispatch) => {
  const userId = getUserId();
  if (!userId) return;

  try {
    const response = await axios.post(`${FIREBASE_URL}/wishlist/${userId}.json`, farm);
    const newFarm = { id: response.data.name, ...farm };
    dispatch(addFarmToWishlist(newFarm));
  } catch (error) {
    console.error("Error adding to wishlist:", error);
  }
};

// ✅ جلب المفضلة من Firebase
export const fetchWishlist = () => async (dispatch) => {
  const userId = getUserId();
  if (!userId) return;

  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${FIREBASE_URL}/wishlist/${userId}.json`);
    const data = response.data
      ? Object.entries(response.data).map(([key, value]) => ({ id: key, ...value }))
      : [];
    dispatch(setWishlist(data));
  } catch (error) {
    console.error("Error fetching wishlist:", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// ✅ إزالة مزرعة من المفضلة
export const removeFromWishlist = (id) => async (dispatch) => {
  const userId = getUserId();
  if (!userId) return;

  dispatch(removeFarmFromWishlist(id)); // حذف مباشرة من Redux لتجربة سلسة
  try {
    await axios.delete(`${FIREBASE_URL}/wishlist/${userId}/${id}.json`);
  } catch (error) {
    console.error("Error removing farm from Firebase:", error);
  }
};
