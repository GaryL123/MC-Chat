import { View, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import AddFriendHeader from '../../components/AddFriendHeader';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext';
import { collection, getDocs, where, onSnapshot, query } from 'firebase/firestore';
import { db, usersRef } from '../../firebaseConfig';
import UserList from '../../components/UserList';

export default function AddFriend() {
    const item = useLocalSearchParams(); // second user
    const { user } = useAuth(); // logged in user
    const [users, setUsers] = useState([]);
    const router = useRouter();
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        if (user?.uid) {
            console.log("addFriend use effect if statement passed");
            getUsers();
        }
    }, [])

    const getFriendsUids = async () => {
        const friendsRef = collection(db, 'users', user.uid, 'friends');
        const snapshot = await getDocs(friendsRef);
        const friendUids = snapshot.docs.map(doc => doc.id);
        return friendUids;
    };

    const getUsers = async () => {
        console.log("addFriend Getting users...");
        try {
            const friendUids = await getFriendsUids();
            const allUsersSnapshot = await getDocs(usersRef);
            let data = [];
            allUsersSnapshot.forEach((doc) => {
                if (!friendUids.includes(doc.id) && doc.id !== user.uid) {
                    data.push({ ...doc.data(), id: doc.id });
                }
            });
            console.log("addFriend Fetched users:", data);
            setUsers(data);
        } catch (error) {
            console.error('addFriend Error subscribing to users:', error);
        }
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

    const handleSearch = async () => {

    }

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <AddFriendHeader router={router} />
            <View className="h-3 border-b border-neutral-300" />
            <View className="flex-1 justify-between bg-neutral-100 overflow-visible">
                <View className="flex-1">
                    <UserList scrollViewRef={scrollViewRef} users={users} currentUser={user} />
                </View>
                <View style={{ marginBottom: hp(2.7) }} className="pt-2">
                    <View className="flex-row mx-3 justify-between bg-white border p-2 border-neutral-300 rounded-full pl-5">
                        <TextInput
                            ref={inputRef}
                            onChangeText={value => textRef.current = value}
                            placeholder='Search users...'
                            placeholderTextColor={'gray'}
                            style={{ fontSize: hp(2) }}
                            className="flex-1 mr-2"
                        />
                        <TouchableOpacity onPress={handleSearch} className="bg-neutral-200 p-2 mr-[1px] rounded-full">
                            <Octicons name="search" size={hp(2.7)} color="#737373" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}
