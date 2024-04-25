import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Switch, Platform } from 'react-native';
import { Image } from 'expo-image';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { defaultProfilePicture } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import roomsLogic from '../logic/roomsLogic';
import styles from '../assets/styles/AppStyles';
import translations from '../assets/styles/Translations';
import { getldStyles } from '../assets/styles/LightDarkStyles';

export default function RoomsCreateScreen() {
    const { language, darkMode, profanityFilter, textSize } = useSettings();
    const navigation = useNavigation();
    const { user, selectedImageUri, setSelectedImageUri, chooseRoomPicture, createRoom } = roomsLogic(navigation);
    const [roomName, setRoomName] = useState('');
    const [roomDesc, setRoomDesc] = useState('');
    const [roomFilter, setRoomFilter] = useState(true);
    const [roomPublic, setRoomPublic] = useState(true);
    const invalidChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const t = (key) => translations[key][language] || translations[key]['English'];
    const ldStyles = getldStyles(textSize);

    const handleChangeRoomPicture = async () => {
        await chooseRoomPicture();
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

        await createRoom(roomName, roomDesc, roomFilter, roomPublic, user?.uid);
    };

    const handleDiscard = async () => {
        setRoomName("");
        setRoomDesc("");
        setRoomPublic(true);
        setSelectedImageUri(null);
        Alert.alert("Changes discarded", "All unsaved changes have been discarded.");
    };

    return (
        <KeyboardAvoidingView style={darkMode ? ldStyles.screenD : ldStyles.screenL} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={ldStyles.container2}>
                    <View style={styles.centered}>
                        <Image style={styles.profileImageProfilePage} source={{ uri: selectedImageUri || defaultProfilePicture }} />
                        <TouchableOpacity style={darkMode ? ldStyles.editButtonD : ldStyles.editButtonL} onPress={handleChangeRoomPicture}>
                            <Octicons name="pencil" size={24} color="#737373" />
                        </TouchableOpacity>
                    </View>

                    <View style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <Octicons name="pencil" size={hp(2.7)} color="gray" />
                        <TextInput
                            value={roomName}
                            onChangeText={setRoomName}
                            style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}
                            placeholder={t("Room Name")}
                            placeholderTextColor={'gray'}
                            autoCapitalize="none"
                            keyboardAppearance={darkMode ? 'dark' : 'light'}
                        />
                    </View>

                    <View style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <Octicons name="pencil" size={hp(2.7)} color="gray" />
                        <TextInput
                            value={roomDesc}
                            onChangeText={setRoomDesc}
                            style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}
                            placeholder={t("Room Description")}
                            placeholderTextColor={'gray'}
                            autoCapitalize="none"
                            keyboardAppearance={darkMode ? 'dark' : 'light'}
                        />
                    </View>

                    <View style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <Ionicons name={roomFilter ? "ear-outline" : "ear"} size={hp(2.7)} color="gray" />
                        <Text style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}>
                            {roomFilter ? t("Profanity Filter On") : t("Profanity Filter Off")}
                        </Text>
                        <Switch
                            onValueChange={() => setRoomFilter(previousState => !previousState)}
                            value={roomFilter}
                            disabled={roomPublic}
                        />
                    </View>

                    <View style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <Octicons name={roomPublic ? "eye" : "eye-closed"} size={hp(2.7)} color="gray" />
                        <Text style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}>
                            {roomPublic ? t("Public") : t("Private")}
                        </Text>
                        <Switch
                            onValueChange={(newValue) => {
                                setRoomPublic(newValue);
                                if (newValue) {
                                    setRoomFilter(true);
                                }
                            }}
                            value={roomPublic}
                        />
                    </View>

                    <View style={styles.inputContainerHoriz}>
                        <TouchableOpacity onPress={handleCreate} style={styles.submitDiscardButtonProfilePage}>
                            <Text style={styles.loginButtonText}>{t("Create")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDiscard} style={styles.submitDiscardButtonProfilePage}>
                            <Text style={styles.loginButtonText}>{t("Discard")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
