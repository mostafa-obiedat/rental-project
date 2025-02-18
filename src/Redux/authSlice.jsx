import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, database, ref, set, get } from "../firebaseConfig";

// تسجيل مستخدم جديد
export const signUpUser = createAsyncThunk(
    "auth/signUpUser",
    async ({ email, password, firstname, lastname, phoneNumber }, { rejectWithValue }) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        const userData = { 
          uid: user.uid, 
          firstname, 
          lastname, 
          email, 
          phoneNumber, 
          isAdmin: false // افتراضيًا، المستخدم ليس أدمن
        };
  
        await set(ref(database, `users/${user.uid}`), userData);
  
        return userData; // إرجاع بيانات المستخدم بما في ذلك isAdmin
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
// تسجيل الدخول بالبريد وكلمة المرور
export const signInUser = createAsyncThunk(
    "auth/signInUser",
    async ({ email, password }, { rejectWithValue }) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
  
        if (!snapshot.exists()) {
          throw new Error("Invalid email or password");
        }
  
        const userData = { 
          ...snapshot.val(), 
          uid: user.uid,
          isAdmin: snapshot.val().isAdmin || false // إذا لم تكن الخاصية موجودة، افترض أن المستخدم ليس أدمن
        };
  
        return userData; // إرجاع بيانات المستخدم بما في ذلك isAdmin
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// تسجيل الدخول باستخدام جوجل
export const signInWithGoogle = createAsyncThunk(
    "auth/signInWithGoogle",
    async (_, { rejectWithValue }) => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
  
        let firstname = "User";
        let lastname = "";
  
        if (user.displayName) {
          const nameParts = user.displayName.split(" ");
          firstname = nameParts[0]; 
          lastname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
        }
  
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
  
        let userData;
        if (!snapshot.exists()) {
          userData = {
            uid: user.uid,
            firstname,
            lastname,
            email: user.email,
            isAdmin: false // افتراضيًا، المستخدم ليس أدمن
          };
          await set(userRef, userData);
        } else {
          userData = { 
            ...snapshot.val(), 
            uid: user.uid,
            isAdmin: snapshot.val().isAdmin || false // إذا لم تكن الخاصية موجودة، افترض أن المستخدم ليس أدمن
          };
        }
  
        return userData; // إرجاع بيانات المستخدم بما في ذلك isAdmin
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    status: "idle",
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload)); // حفظ البيانات في localStorage
    },
    updateUser: (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
    },
    clearUser: (state) => {
        state.user = null;
        localStorage.removeItem("user"); // حذف البيانات من localStorage عند الخروج
    },
    resetStatus: (state) => {
        state.status = "idle";
        state.error = null;  // أو null
      },
    logout: (state) => {
        state.user = null;
        localStorage.removeItem("user");
    },
    clearError: (state) => {
        state.error = null;
    },
    clearSuccessMessage: (state) => {
        state.successMessage = "";
    },
    
  },
  extraReducers: (builder) => {
    builder
        .addCase(signUpUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.status = "succeeded";
            localStorage.setItem("user", JSON.stringify(action.payload)); // حفظ البيانات في localStorage
        })
        .addCase(signInUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.status = "succeeded";
            localStorage.setItem("user", JSON.stringify(action.payload)); // حفظ البيانات في localStorage
        })
        .addCase(signInWithGoogle.fulfilled, (state, action) => {
            state.user = action.payload; // البيانات كاملة بما في ذلك firstname و lastname
            state.status = "succeeded";
            localStorage.setItem("user", JSON.stringify(action.payload)); // حفظ البيانات في localStorage
        })    
        .addCase(signUpUser.rejected, (state, action) => {
            state.error = action.payload;
            state.status = "failed";
        })
        .addCase(signInUser.rejected, (state, action) => {
            state.error = action.payload;
            state.status = "failed";
        })
        .addCase(signInWithGoogle.rejected, (state, action) => {
            state.error = action.payload;
            state.status = "failed";
        });
  },
});

export const { setUser, clearUser,resetStatus, logout, clearError, clearSuccessMessage, updateUser  } = authSlice.actions;
export default authSlice.reducer;