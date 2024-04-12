import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from './authContext'
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const profileLogic = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setProfile(userSnap.data());
                } else {
                    console.log("No user profile found in Firestore");
                }
            }
        };

        fetchUserProfile();
    }, [user]);

    const changeProfilePicture = async () => {
        
    };

    const changeFName = async (fName) => {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { fName: fName });
        setProfile(prev => ({ ...prev, fName: fName }));
    };

    const changeLName = async (lName) => {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { lName: lName });
        setProfile(prev => ({ ...prev, lName: lName }));
    };

    const changeEmail = async (email) => {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { email: email });
        setProfile(prev => ({ ...prev, email: email }));
    };

    const changePassword = async (password) => {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { password: password });
        setProfile(prev => ({ ...prev, password: password }));
    };

    return { user: profile, changeProfilePicture, changeFName, changeLName, changeEmail, changePassword };
}

export default profileLogic;
