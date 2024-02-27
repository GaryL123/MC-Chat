import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from 'firebase/firestore'
import axios from 'axios';
import { obtainGoogleAccessToken } from "../oauthConfig";

export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user)=>{
            // console.log('got user: ', user);
            if(user){
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid);
            }else{
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unsub;
    },[]);

    const fetchGoogleProfile = async (accessToken) => {
        try {
            const response = await axios.get('https://people.googleapis.com/v1/people/me?personFields=names,photos', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const { names, photos } = response.data;
            const profileName = names[0]?.displayName;
            const profilePicture = photos[0]?.url;

            return {profileName, profilePicture };
        } catch (error) {
            console.error('Error fetching Google profile:', error);
            return { profileName: undefined, profilePicture: undefined };
        }
    }

    const updateUserData = async (userId)=>{
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            let data = docSnap.data();
            setUser({...user, username: data.username, profileUrl: data.profileUrl, userId: data.userId})
        }
    }

    const login = async (email, password)=>{
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            return {success: true};
        }catch(e){
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)')) msg='Invalid email'
            if(msg.includes('(auth/invalid-credential)')) msg='Wrong credentials'
            return {success: false, msg};
        }
    }

    const logout = async ()=>{
        try{
            await signOut(auth);
            return {success: true}
        }catch(e){
            return {success: false, msg: e.message, error: e};
        }
    }

    const register = async (email, password)=>{
        try{
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('response.user :', response?.user);

            // setUser(response?.user);
            // setIsAuthenticated(true);

            const accessToken = await obtainGoogleAccessToken();

            const {profileName, profilePicture } = await fetchGoogleProfile(accessToken);

            await setDoc(doc(db, "users", response?.user?.uid),{
                userId: response?.user?.uid,
                email,
                name: profileName,
                profileUrl: profilePicture,
            });
            
            return {success: true, data: response?.user};
        }catch(e){
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)')) msg='Invalid email'
            if(msg.includes('(auth/email-already-in-use)')) msg='This email is already in use'
            return {success: false, msg};
        }
    }

    const resetPassword = async (email)=>{
        try{
            await sendPasswordResetEmail(auth, email);
            return { success: true, msg: 'Password reset email sent.' };
        }catch(e){
            let msg = e.message;
            if (msg.includes('auth/invalid-email')) msg = 'Invalid email';
            if (msg.includes('auth/user-not-found')) msg = 'No user found with this email';
            return { success: false, msg };
        }
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, register, logout, resetPassword}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    const value = useContext(AuthContext);

    if(!value){
        throw new Error('useAuth must be wrapped inside AuthContextProvider');
    }
    return value;
}
