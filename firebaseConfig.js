// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "justnotesapp-3ed84.firebaseapp.com",
  projectId: "justnotesapp-3ed84",
  storageBucket: "justnotesapp-3ed84.appspot.com",
  messagingSenderId: "715136857607",
  appId: "1:715136857607:web:44840ec84b902c1b105ca2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);