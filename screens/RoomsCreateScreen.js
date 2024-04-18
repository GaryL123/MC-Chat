import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Switch, Platform } from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../assets/styles/AppStyles';
import { blurhash } from '../logic/commonLogic';
import profileLogic from '../logic/profileLogic';
import roomsLogic from '../logic/roomsLogic';

export default function RoomsCreateScreen() {
    const { user, createRoom } = roomsLogic();
    const [roomName, setRoomName] = useState('');
    const [roomDesc, setRoomDesc] = useState('');
    const [roomPublic, setRoomPublic] = useState(true);
    const invalidChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    const handleChangeRoomPicture = async () => {
        await changeRoomPicture();
    };

    const handleCreate = async () => {
        if (!roomName) {
            Alert.alert('Create Room', 'Please enter a room name');
            return;
        }

        if (roomName) {
            if (roomName.length < 3 || roomName.length > 20 || invalidChars.test(roomName)) {
                Alert.alert('Create Room', 'Room Name should be between 3 and 20 characters and not contain special characters')
                return;
            }
        }

        if (!roomDesc) {
            Alert.alert('Create Room', 'Please enter a room description');
            return;
        }

        if (roomDesc) {
            if (roomDesc.length < 5 || roomDesc.length > 50 || invalidChars.test(roomDesc)) {
                Alert.alert('Create Room', 'Room Description should be between 5 and 50 characters and not contain special characters')
                return;
            }
        }

        await createRoom(roomName, roomDesc, blurhash, roomPublic, user?.uid);
    };

    const handleDiscard = async () => {

    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <View style={styles.centered}>
                        <Image style={styles.profileImageProfilePage} source={{ blurhash }} />
                        <TouchableOpacity style={styles.editButton} onPress={{ handleChangeRoomPicture }}>
                            <Octicons name="pencil" size={24} color="#737373" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Octicons name="pencil" size={hp(2.7)} color="gray" />
                        <TextInput
                            value={roomName}
                            onChangeText={setRoomName}
                            style={styles.input}
                            placeholder={'Room Name'}
                            placeholderTextColor={'gray'}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Octicons name="pencil" size={hp(2.7)} color="gray" />
                        <TextInput
                            value={roomDesc}
                            onChangeText={setRoomDesc}
                            style={styles.input}
                            placeholder={'Room Description'}
                            placeholderTextColor={'gray'}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Octicons name={roomPublic ? "eye" : "eye-closed"} size={hp(2.7)} color="gray" />
                        <Text style={{
                            flex: 1,
                            paddingHorizontal: 10,
                            paddingVertical: hp(1.5),
                            fontSize: hp(2),
                            color: '#888',
                            marginRight: 10  // Maintain spacing from the switch
                        }}>
                            {roomPublic ? 'Public' : 'Private'}
                        </Text>
                        <Switch
                            onValueChange={() => setRoomPublic(previousState => !previousState)}
                            value={roomPublic}
                        />
                    </View>

                    <View style={styles.inputContainerHoriz}>
                        <TouchableOpacity onPress={handleCreate} style={styles.submitDiscardButtonProfilePage}>
                            <Text style={styles.loginButtonText}>Create</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDiscard} style={styles.submitDiscardButtonProfilePage}>
                            <Text style={styles.loginButtonText}>Discard</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
