// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzG4n2im9dte_fR8SPPq5IRwdY1XN6MwY",
  authDomain: "ticket-bari-15f05.firebaseapp.com",
  projectId: "ticket-bari-15f05",
  storageBucket: "ticket-bari-15f05.firebasestorage.app",
  messagingSenderId: "945554937476",
  appId: "1:945554937476:web:298a3b112e679abd1994d1"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);