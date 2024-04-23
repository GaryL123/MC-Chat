import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Switch, Platform } from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { blurhash } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import roomsLogic from '../logic/roomsLogic';
import styles from '../assets/styles/AppStyles';
import ldStyles from '../assets/styles/LightDarkStyles';

export default function RoomsCreateScreen() {
    const { language, darkMode, profanityFilter, textSize } = useSettings();
    const navigation = useNavigation();
    const { user, createRoom } = roomsLogic(navigation);
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
        <KeyboardAvoidingView style={darkMode ? ldStyles.screenD : ldStyles.screenL} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <View style={styles.centered}>
                        <Image style={styles.profileImageProfilePage} source={{ blurhash }} />
                        <TouchableOpacity style={darkMode ? ldStyles.editButtonD : ldStyles.editButtonL} onPress={{ handleChangeRoomPicture }}>
                            <Octicons name="pencil" size={24} color="#737373" />
                        </TouchableOpacity>
                    </View>

                    <View style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <Octicons name="pencil" size={hp(2.7)} color="gray" />
                        <TextInput
                            value={roomName}
                            onChangeText={setRoomName}
                            style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}
                            placeholder={'Room Name'}
                            placeholderTextColor={'gray'}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <Octicons name="pencil" size={hp(2.7)} color="gray" />
                        <TextInput
                            value={roomDesc}
                            onChangeText={setRoomDesc}
                            style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}
                            placeholder={'Room Description'}
                            placeholderTextColor={'gray'}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <Octicons name={roomPublic ? "eye" : "eye-closed"} size={hp(2.7)} color="gray" />
                        <Text style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}>
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
