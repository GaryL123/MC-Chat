import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Octicons } from '@expo/vector-icons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';

export default function CreateChatRoomHeader({ router }) {
    return (
        <Stack.Screen
            options={{
                title: '',
                headerShadowVisible: false,
                headerLeft: () => (
                    <View className="flex-row items-center gap-4">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Octicons name="chevron-left" size={hp(4)} color="#737373" />
                        </TouchableOpacity>
                        <View>
                            <Text style={{ fontSize: hp(2.5) }} className="text-neutral-700 font-medium">
                                Create Chat Room
                            </Text>
                        </View>
                    </View>
                )
            }}
        />
    )
}
