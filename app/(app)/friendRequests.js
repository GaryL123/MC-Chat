import { View, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import AddFriendHeader from '../../components/AddFriendHeader';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext';
import { collection, doc, getDoc, getDocs, where, onSnapshot, query } from 'firebase/firestore';
import { db, usersRef } from '../../firebaseConfig';
import RequestList from '../../components/RequestList';
import FriendRequestHeader from '../../components/FriendRequestHeader';

export default function AddFriend() {
    const item = useLocalSearchParams(); // second user
    const { user } = useAuth(); // logged in user
    const [users, setUsers] = useState([]);
    const router = useRouter();
    const scrollViewRef = useRef(null);

    useEffect(() => {
        if (user?.uid) {
            console.log("addFriend use effect if statement passed");
            getRequests();
        }
    }, [])

    const onFriendRequestProcessed = (processedId) => {
        setUsers(currentUsers => currentUsers.filter(user => user.id !== processedId));
    };

    const getRequests = async () => {
        console.log("Fetching friend requests...");
        const friendRequestsRef = collection(db, 'users', user?.uid, 'friendsReceived');
        const querySnapshot = await getDocs(friendRequestsRef);
        let friendRequestIds = [];
        querySnapshot.forEach((doc) => {
            friendRequestIds.push(doc.data().uid);
        });

        let friendRequests = [];
        for (let uid of friendRequestIds) {
            const userDocRef = doc(db, 'users', uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                friendRequests.push({ id: userDocSnap.id, ...userDocSnap.data() });
            }
        }
        console.log("Fetched friend requests:", friendRequests);
        setUsers(friendRequests);
    };

    useEffect(() => {
        const KeyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow', updateScrollView
        )

        return () => {
            KeyboardDidShowListener.remove();
        }
    }, []);

    useEffect(() => {
        updateScrollView();
    }, [usersRef])

    const updateScrollView = () => {
        setTimeout(() => {
            scrollViewRef?.current?.scrollToEnd({ animated: true })
        }, 100)
    }

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <FriendRequestHeader router={router} />
            <View className="h-3 border-b border-neutral-300" />
            <View className="flex-1 justify-between bg-neutral-100 overflow-visible">
                <View className="flex-1">
                    <RequestList scrollViewRef={scrollViewRef} users={users} currentUser={user} onFriendRequestProcessed={onFriendRequestProcessed} />
                </View>
            </View>
        </View>
    )
}
