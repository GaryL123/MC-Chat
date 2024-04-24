import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from './authContext'
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebaseConfig';
import { getAuth, updateProfile } from "firebase/auth";

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

    const chooseProfilePicture = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your photos!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.cancelled) {
            //console.log(result);
            const { uri } = result.assets[0];
            //console.log(uri);
            if (uri) {
                changeProfilePicture(uri);
            } else {
                console.error('No URI found in result object:', result);
            }
        }
    };

    const changeProfilePicture = async (uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const storage = getStorage();
            const userProfilePicRef = storageRef(storage, `profilePictures/${user.uid}`);

            await uploadBytes(userProfilePicRef, blob);

            const downloadURL = await getDownloadURL(userProfilePicRef);

            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { photoURL: downloadURL });

            const auth = getAuth();
            await updateProfile(auth.currentUser, {
                photoURL: downloadURL
            });

            setProfile(prev => ({
                ...prev,
                photoURL: downloadURL
            }));
        } catch (error) {
            console.error("Error uploading profile picture: ", error);
            alert("Error uploading profile picture: " + error.message);
        }
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

    const changeMajor = async (major) => {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { major: major });
        setProfile(prev => ({ ...prev, major: major }));
    };

    const changeGradYear = async (gradYear) => {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { gradYear: gradYear });
        setProfile(prev => ({ ...prev, gradYear: gradYear }));
    };

    const changeFaculty = async (faculty) => {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { faculty: faculty });
        setProfile(prev => ({ ...prev, faculty: faculty }));
    };

    const changePassword = async (password) => {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { password: password });
        setProfile(prev => ({ ...prev, password: password }));
    };

    return { user: profile, chooseProfilePicture, changeProfilePicture, changeFName, changeLName, changeEmail, changeMajor, changeGradYear, changeFaculty, changePassword };
}

export default profileLogic;
