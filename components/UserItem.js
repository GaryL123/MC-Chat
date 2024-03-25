import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { blurhash } from '../utils/common';
import { Octicons } from '@expo/vector-icons';
import { useAuth } from '../context/authContext';
import { addDoc, collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function UserItem({ item, noBorder }) {
    const { user } = useAuth();
    const [friendRequestSent, setFriendRequestSent] = useState(false);

    useEffect(() => {
        // Fetch sent friend requests for the current user
        const fetchSentFriendRequests = async () => {
            try {
                const sentRequestsQuery = query(collection(doc(db, 'users', user?.uid), 'friendsSent'), where('uid', '==', item?.uid));
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
        const friendRequestId = `${user.uid}-${item.uid}`;
        console.log("attempting to send friend request");
        setFriendRequestSent(true);

        await setDoc(doc(db, 'users', item.uid, 'friendsReceived', friendRequestId), {
            uid: user?.uid,
        });
        await setDoc(doc(db, 'users', user.uid, 'friendsSent', friendRequestId), {
            uid: item?.uid,
        });
    }

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

            <TouchableOpacity onPress={sendFriendRequest} style={{ padding: 10, backgroundColor: 'green', borderRadius: 5 }}>
                <Octicons name={friendRequestSent ? "check" : "person-add"} size={20} color="white" />
            </TouchableOpacity>
        </View>
    );
}
