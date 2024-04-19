// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1fAN1kq2xM3rN8IFHfQh_3F82jBmbgTY",
    authDomain: "mc-chat-b6bef.firebaseapp.com",
    databaseURL: "https://mc-chat-b6bef-default-rtdb.firebaseio.com",
    projectId: "mc-chat-b6bef",
    storageBucket: "mc-chat-b6bef.appspot.com",
    messagingSenderId: "706298541322",
    appId: "1:706298541322:web:b714b576fcc384844536f3",
    measurementId: "G-WT8HHRDRJQ"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase auth with custom persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth, app };

export const db = getFirestore(app);
export const usersRef = collection(db, 'users');
export const chatIndsRef = collection(db, 'chatInds');
export const chatRoomsRef = collection(db, 'chatRooms');
