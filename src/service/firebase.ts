import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
   query, where, limit,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgQKBzmEgXdP5TYnBfHSn_H9Sqdsmt1tc",
  authDomain: "fitelle-3c6d3.firebaseapp.com",
  projectId: "fitelle-3c6d3",
  storageBucket: "fitelle-3c6d3.firebasestorage.app",
  messagingSenderId: "212251180510",
  appId: "1:212251180510:web:9872c1e3b08641033ef14f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export {
  auth,
  createUserWithEmailAndPassword,
  db,
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateDoc,
  deleteDoc,
  getDocs,
   query, where, limit,
};
