import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWSQ2gmm_iPrMuYspOjuUQs9VH37BkI_I",
  authDomain: "car-rental-app-ae22f.firebaseapp.com",
  projectId: "car-rental-app-ae22f",
  storageBucket: "car-rental-app-ae22f.firebasestorage.app",
  messagingSenderId: "75827101307",
  appId: "1:75827101307:web:3306c9d03c8f343614acde",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
