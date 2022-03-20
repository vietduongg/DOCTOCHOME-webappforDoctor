import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6wTEyBWqMmOdyt351gWX0KWJ_JwJJgac",
  authDomain: "doctor-home-1c0a5.firebaseapp.com",
  databaseURL: "https://doctor-home-1c0a5-default-rtdb.firebaseio.com",
  projectId: "doctor-home-1c0a5",
  storageBucket: "doctor-home-1c0a5.appspot.com",
  messagingSenderId: "299186204859",
  appId: "1:299186204859:web:482618bc0ebbff8617799e",
  measurementId: "G-CY3V1RZWK9",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

const storageRef = ref(storage);

export {
  auth,
  storage,
  storageRef,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  db,
};
