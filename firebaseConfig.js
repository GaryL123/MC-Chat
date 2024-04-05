// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the auth service
const auth = getAuth(app);
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

export { auth };
