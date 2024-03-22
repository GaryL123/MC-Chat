import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);


    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                const updatedUserData = await updateUserData(user.uid);
                setUser(user);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unsub;
    }, []);

    const updateUserData = async (userId) => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let data = docSnap.data();
            return { ...user, userId: data.userId, email: data.email }
        } else {
            return null;
        }
    }

    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (e) {
            let msg = e.message;
            if (msg.includes('(auth/invalid-email)')) msg = 'Invalid email'
            if (msg.includes('(auth/invalid-credential)')) msg = 'Wrong credentials'
            return { success: false, msg };
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true }
        } catch (e) {
            return { success: false, msg: e.message, error: e };
        }
    }
    const register = async (email, fName, lName, password) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);

            setIsAuthenticated(true);

            await setDoc(doc(db, "users", response?.user?.uid), {
                userId: response?.user?.uid,
                email: response?.user?.email,
                fName: fName,
                lName: lName
            });

            await setDoc(doc(db, "users", response?.user?.uid, "friends", "initial_friend"), {
                friendId: "initial_friend",
                status: "placeholder"
            });

            await setDoc(doc(db, "users", response?.user?.uid, "friendsPending", "initial_friend"), {
                friendId: "initial_friend",
                status: "placeholder"
            });

            return { success: true, data: response?.user };
        } catch (e) {
            let msg = e.message;
            if (msg.includes('(auth/invalid-email)')) msg = 'Invalid email'
            if (msg.includes('(auth/email-already-in-use)')) msg = 'This email is already in use'
            return { success: false, msg };
        }
    }
    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true, msg: 'Password reset email sent.' };
        } catch (e) {
            let msg = e.message;
            if (msg.includes('auth/invalid-email')) msg = 'Invalid email';
            if (msg.includes('auth/user-not-found')) msg = 'No user found with this email';
            return { success: false, msg };
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error('useAuth must be wrapped inside AuthContextProvider');
    }
    return value;
}
