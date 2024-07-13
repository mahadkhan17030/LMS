// firebaseConfig.ts

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB0oDfjQY_7SToBfMjHUybvOXjltA1HgFY",
  authDomain: "software-lms-cada3.firebaseapp.com",
  databaseURL: "https://software-lms-cada3-default-rtdb.firebaseio.com",
  projectId: "software-lms-cada3",
  storageBucket: "software-lms-cada3.appspot.com",
  messagingSenderId: "595895974186",
  appId: "1:595895974186:web:f944bd9f8d7dd663ce0653",
  measurementId: "G-ZYJ18KKD7Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service

export  default app;