// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { 
  getDatabase, 
  ref, 
  set, 
  get ,
  update,
  onValue,
  remove
} from "firebase/database";
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_jX9iu6wYsSK6wFDjvvQ7DNA5CFBFDoo",
  authDomain: "rent-app-d50fb.firebaseapp.com",
  databaseURL: "https://rent-app-d50fb-default-rtdb.firebaseio.com/",
  projectId: "rent-app-d50fb",
  storageBucket: "rent-app-d50fb.firebasestorage.app",
  messagingSenderId: "463787498729",
  appId: "1:463787498729:web:4e90d853455383b53ce478",
  measurementId: "G-DXBCXDVT7E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// Export the initialized instances
export { 
  app, 
  auth, 
  database, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  ref, 
  set, 
  get,
  remove,
  update,
  onValue
};