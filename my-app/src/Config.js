// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDB9pFOmyLn8bzCGSi4_ZCBZ5jqDWDcSwI",
    authDomain: "perennail-data.firebaseapp.com",
    projectId: "perennail-data",
    storageBucket: "perennail-data.appspot.com",
    messagingSenderId: "417681469490",
    appId: "1:417681469490:web:ecc39644a8dce3cab2cc2b"
  };

const app = initializeApp(firebaseConfig);
export const imgDb = getStorage(app);