import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { blurhash } from '../utils/common';
import { Octicons } from '@expo/vector-icons';
import { useAuth } from '../context/authContext';
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function RequestItem({ item, noBorder, onFriendRequestProcessed }) {
    const { user } = useAuth();
    const [friendRequestSent, setFriendRequestSent] = useState(false);

    const requestApprove = async () => {
        const friendRequestId = `${item.uid}-${user.uid}`;
        const friendRequestId2 = `${user.uid}-${item.uid}`;
    
        // Add each other as friends
        await setDoc(doc(db, 'users', user.uid, 'friends', item.uid), {
            uid: item.uid,
        });
        await setDoc(doc(db, 'users', item.uid, 'friends', user.uid), {
            uid: user.uid,
        });
    
        // Remove the friend request from friendsReceived and friendsSent
        await Promise.all([
            deleteDoc(doc(db, 'users', user.uid, 'friendsReceived', friendRequestId)),
            deleteDoc(doc(db, 'users', user.uid, 'friendsReceived', friendRequestId2)),
            deleteDoc(doc(db, 'users', item.uid, 'friendsSent', friendRequestId)),
            deleteDoc(doc(db, 'users', item.uid, 'friendsSent', friendRequestId2)),
        ]);

        onFriendRequestProcessed(item.id);
    };

    const requestDeny = async () => {
        const friendRequestId = `${item.uid}-${user.uid}`;
    
        // Remove the friend request
        await Promise.all([
            deleteDoc(doc(db, 'users', user.uid, 'friendsReceived', friendRequestId)),
            deleteDoc(doc(db, 'users', user.uid, 'friendsReceived', friendRequestId2)),
            deleteDoc(doc(db, 'users', item.uid, 'friendsSent', friendRequestId)),
            deleteDoc(doc(db, 'users', item.uid, 'friendsSent', friendRequestId2)),
        ]);

        onFriendRequestProcessed(item.id);
    };

    return (
        <View className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 ${noBorder ? '' : 'border-b border-b-neutral-200'}`}>
            <Image
                style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
                source={item?.profileUrl}
                placeholder={blurhash}
                transition={500}
            />

            <View className="flex-1 gap-1">
                <Text style={{ fontSize: hp(2.0) }} className="font-semibold text-neutral-800">{item?.fName + ' ' + item?.lName}</Text>
                {/* You could add more user details here */}
            </View>

            <TouchableOpacity onPress={requestApprove} style={{ padding: 10, backgroundColor: 'green', borderRadius: 5 }}>
                <Octicons name="check" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={requestDeny} style={{ padding: 10, backgroundColor: 'red', borderRadius: 5 }}>
                <Octicons name="x" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );
}
