import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { blurhash } from '../utils/common';
import { Octicons } from '@expo/vector-icons';

export default function UserItem({ item, noBorder, currentUser }) {
    const [friendRequestSent, setFriendRequestSent] = useState(false);

    const sendFriendRequest = () => {
        setFriendRequestSent(true);
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
