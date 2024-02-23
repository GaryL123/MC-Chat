import { initializeApp } from "firebase/app";

import {getReactNativePersistence, initializeAuth} from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getFirestore, collection} from 'firebase/firestore'



const firebaseConfig = {
  apiKey: "AIzaSyD1fAN1kq2xM3rN8IFHfQh_3F82jBmbgTY",
  authDomain: "mc-chat-b6bef.firebaseapp.com",
  projectId: "mc-chat-b6bef",
  storageBucket: "mc-chat-b6bef.appspot.com",
  messagingSenderId: "706298541322",
  appId: "1:706298541322:web:b714b576fcc384844536f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');
