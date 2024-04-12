import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from './authContext'
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const profileLogic = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                const userRef = doc(db, "users", user.uid);  // Adjust "users" to your actual collection path
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

    return { user: profile };
}

export default profileLogic;
