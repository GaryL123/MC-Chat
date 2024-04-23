import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { auth, db } from "../firebaseConfig";
import { collection, doc, getDoc, getDocs, setDoc, onSnapshot } from 'firebase/firestore'

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [pendingFriendRequests, setPendingFriendRequests] = useState([]);
    const [pendingRoomInvites, setPendingRoomInvites] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);


    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                updateUserState(user);
                fetchPendingFriendRequests(user.uid);
                listenForPendingFriendRequests(user.uid);
                fetchPendingRoomInvites(user.uid);
                listenForPendingRoomInvites(user.uid);
            } else {
                setIsAuthenticated(false);
                setUser(null);
                setPendingFriendRequests([]);
                setPendingRoomInvites([]);
            }
        });
        return unsub;
    }, []);
    

    const updateUserState = async (user) => {
        const userData = await updateUserData(user.uid);
        setUser({
            ...user,
            ...userData,
        });
    };

    const updateUserData = async (uid) => {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let data = docSnap.data();
            return { ...user, uid: data.uid, email: data.email, fName: data.fName, lName: data.lName, photoURL: data.photoURL }
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
                uid: response?.user?.uid,
                email: response?.user?.email,
                fName: fName,
                lName: lName
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

    const fetchPendingFriendRequests = async (uid) => {
        const requestsRef = collection(db, 'users', uid, 'friendsReceived');
        const querySnapshot = await getDocs(requestsRef);
        const requests = querySnapshot.docs.map(doc => ({
            id: doc.id, // Friend Request ID
            ...doc.data()
        }));
        setPendingFriendRequests(requests);
    };
    const listenForPendingFriendRequests = (uid) => {
        const requestsRef = collection(db, 'users', uid, 'friendsReceived');

        const unsubscribe = onSnapshot(requestsRef, (snapshot) => {
            const requests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPendingFriendRequests(requests);
        });

        return unsubscribe; // Ensure you unsubscribe to avoid memory leaks
    };
    const fetchPendingRoomInvites = async (uid) => {
        const requestsRef = collection(db, 'users', uid, 'invitesReceived');
        const querySnapshot = await getDocs(requestsRef);
        const requests = querySnapshot.docs.map(doc => ({
            id: doc.id, // Friend Request ID
            ...doc.data()
        }));
        setPendingRoomInvites(requests);
    };
    const listenForPendingRoomInvites = (uid) => {
        const requestsRef = collection(db, 'users', uid, 'invitesReceived');

        const unsubscribe = onSnapshot(requestsRef, (snapshot) => {
            const requests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPendingRoomInvites(requests);
        });

        return unsubscribe; // Ensure you unsubscribe to avoid memory leaks
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, pendingFriendRequests, pendingRoomInvites, login, register, logout, resetPassword, fetchPendingFriendRequests, fetchPendingRoomInvites, updateUserData }}>
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
