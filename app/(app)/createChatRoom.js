import { View, Text, Image, TextInput, TouchableOpacity, Pressable, ActivityIndicator, Switch, Touchable } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../../components/ChatList';
import Loading from '../../components/Loading';
import { doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db, usersRef } from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import CreateChatRoomHeader from '../../components/CreateChatRoomHeader';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import { Octicons } from '@expo/vector-icons';

export default function CreateChatRoom() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isPublic, setIsPublic] = useState(true);
    const router = useRouter();
    const nameRef = useRef("");
    const descRef = useRef("");
    const invalidChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    const handleCreateRoom = async () => {
        console.log('beginning room creation');

        if (!nameRef.current || !descRef.current) {
            Alert.alert('Create Chat Room', "Please fill all the fields!");
            return;
        }

        if(nameRef.current.length < 2 || nameRef.current.length > 30) {
            Alert.alert('Create Chat Room', 'Chat Room Name should be between 2 and 30 characters')
            return;
        }

        if(descRef.current.length < 5 || descRef.current.length > 100) {
            Alert.alert('Create Chat Room', 'Last Name should be between 5 and 100 characters')
            return;
        }

        if(invalidChars.test(nameRef.current)) {
            Alert.alert('Create Chat Room', 'Chat Room Name should not contain any special characters')
            return;
        }

        console.log('Input validation passed');

        await setDoc(doc(db, "chatRooms", nameRef.current), {
            name: nameRef.current,
            desc: descRef.current,
            //picture: user?.profileUrl,
            public: isPublic,
            createdBy: user?.uid
        });

        console.log('Room created');
    }

    const handleUploadImage = async () => {

    }

    return (
        <CustomKeyboardView>
            <StatusBar style="dark" />
            <CreateChatRoomHeader router={router} />
            <View style={{ paddingTop: hp(2.5), paddingHorizontal: wp(5) }} className="flex-1 gap-7">
                <View>
                    <View className="gap-4">
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                            <Octicons name="book" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={(value) => nameRef.current = value}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder='Name'
                                placeholderTextColor={'gray'}
                            />
                        </View>
                        <View className="gap-3">
                            <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                                <Octicons name="info" size={hp(2.7)} color="gray" />
                                <TextInput
                                    onChangeText={value => descRef.current = value}
                                    style={{ fontSize: hp(2) }}
                                    className="flex-1 font-semibold text-neutral-700"
                                    placeholder='Description'
                                    placeholderTextColor={'gray'}
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={handleUploadImage} className="gap-3">
                            <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                                <Octicons name="image" size={hp(2.7)} color="gray" />
                                <TextInput
                                    //editable={false}
                                    //selectTextOnFocus={false}
                                    style={{ fontSize: hp(2) }}
                                    className="flex-1 font-semibold text-neutral-700"
                                    placeholder='Display Picture'
                                    placeholderTextColor={'gray'}
                                />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity className="gap-3">
                            <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                                <Octicons name="eye" size={hp(2.7)} color="gray" />
                                <TextInput
                                    //editable={false}
                                    //selectTextOnFocus={false}
                                    style={{ fontSize: hp(2) }}
                                    className="flex-1 font-semibold text-neutral-700"
                                    placeholder='Public Room'
                                    placeholderTextColor={'gray'}
                                />
                                <Switch
                                    value={isPublic}
                                    onValueChange={(value) => setIsPublic(value)}
                                />
                            </View>
                        </TouchableOpacity>

                        {/* submit button */}

                        <View>
                            {
                                loading ? (
                                    <View className="flex-row justify-center">
                                        <Loading size={hp(6.5)} />
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={handleCreateRoom} style={{ height: hp(6.5), backgroundColor: '#166939' }} className="rounded-xl justify-center items-center">
                                        <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                                            Create
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>

                    </View>

                </View>
            </View>
        </CustomKeyboardView>
    )
}
