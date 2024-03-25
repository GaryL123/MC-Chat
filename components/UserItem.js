import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { blurhash } from '../utils/common';
import { Octicons } from '@expo/vector-icons';
import { useAuth } from '../context/authContext';
import { addDoc, collection, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function UserItem({ item, noBorder }) {
    const { user } = useAuth();
    const [friendRequestSent, setFriendRequestSent] = useState(false);

    useEffect(() => {
        // Fetch sent friend requests for the current user
        const fetchSentFriendRequests = async () => {
            try {
                const sentRequestsQuery = query(collection(doc(db, 'users', user?.uid), 'friendsSent'), where('friendId', '==', item?.uid));
                const sentRequestsSnapshot = await getDocs(sentRequestsQuery);
                if (!sentRequestsSnapshot.empty) {
                    // If a friend request has been sent to this user, mark it as sent
                    setFriendRequestSent(true);
                }
            } catch (error) {
                console.error('Error fetching sent friend requests:', error);
            }
        };
        fetchSentFriendRequests();
    }, [user?.uid, item?.uid]);

    const sendFriendRequest = async () => {
        console.log("attempting to send friend request");
        setFriendRequestSent(true);
        try {
            console.log("useritem sendfriendrequest try");
            const docRef = doc(db, 'users', item?.uid);
            console.log("item userID: " + item?.uid);
            const requestsRef = collection(docRef, "friendsReceived");
            const newDoc = await addDoc(requestsRef, {
                friendId: user?.uid,
            });
        } catch (err) {
            Alert.alert('Message', err.message);
        }

        try {
            console.log("useritem sendfriendrequest try");
            const doc2Ref = doc(db, 'users', user?.uid);
            console.log("item userID: " + user?.uid);
            const requests2Ref = collection(doc2Ref, "friendsSent");
            const newDoc = await addDoc(requests2Ref, {
                friendId: item?.uid,
            });
        } catch (err) {
            Alert.alert('Message', err.message);
        }
    }

    return (
        <View className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 ${noBorder ? '' : 'border-b border-b-neutral-200'}`}>
            {/* Display user profile image */}
            <Image
                style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
                source={item?.profileUrl}
                placeholder={blurhash}
                transition={500}
            />
            <View className="flex-1 gap-1">
                {/* Display user's full name */}
                <Text style={{ fontSize: hp(2.0) }} className="font-semibold text-neutral-800">{item?.fName + ' ' + item?.lName}</Text>
                {/* You could add more user details here */}
            </View>

            {/* Button to send friend request */}
            <TouchableOpacity onPress={sendFriendRequest} style={{ padding: 10, backgroundColor: 'green', borderRadius: 5 }}>
                {/* Display different icon if friend request has already been sent */}
                <Octicons name={friendRequestSent ? "check" : "person-add"} size={20} color="white" />
            </TouchableOpacity>
        </View>
    );
}
