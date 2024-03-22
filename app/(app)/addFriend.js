import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import AddFriendHeader from '../../components/AddFriendHeader';
import MessageList from '../../components/MessageList';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import { useAuth } from '../../context/authContext';
import { Timestamp, addDoc, collection, doc, where, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
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
        console.log('Current users state:', users);
    }, [users]);

    useEffect(() => {
        console.log('getting users')
        console.log(user?.uid)
        if (user?.uid)
            getUsers();
        console.log(user?.uid)
    }, [])

    const getUsers = () => {
        console.log('Subscribing to users...');
        const q = query(usersRef, where('userId', '!=', user?.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let data = [];
            querySnapshot.forEach((doc) => {
                console.log('User found:', doc.data());
                data.push({ ...doc.data(), id: doc.id });
            });
            setUsers(data);
            console.log('Users set:', data);
        }, (error) => {
            console.error('Error subscribing to users:', error);
        });

        return unsubscribe;
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
