import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform, Switch } from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { defaultProfilePicture } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import roomsLogic from '../logic/roomsLogic';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import styles from '../assets/styles/AppStyles';
import { getldStyles } from '../assets/styles/LightDarkStyles';

export default function RoomsSettingsScreen() {
  const { language, darkMode, profanityFilter, textSize } = useSettings();
  const route = useRoute();
  const { roomId, roomPhoto: initialRoomPhoto, roomName: initialRoomName, roomDesc: initialRoomDesc, roomFilter: initialRoomFilter, roomPublic: initialRoomPublic } = route.params;
  const [roomPhoto, setRoomPhoto] = useState(initialRoomPhoto);
  const [roomName, setRoomName] = useState(initialRoomName);
  const [roomDesc, setRoomDesc] = useState(initialRoomDesc);
  const [roomFilter, setRoomFilter] = useState(initialRoomFilter);
  const [roomPublic, setRoomPublic] = useState(initialRoomPublic);
  const navigation = useNavigation();
  const { chooseRoomPicture2, changeRoomName, changeRoomDesc, changeRoomFilter, changeRoomPublic } = roomsLogic(navigation);
  const invalidChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  const ldStyles = getldStyles(textSize);

  const handleChangeRoomPicture = async () => {
    const newRoomPhotoUrl = await chooseRoomPicture2(roomId);
    if (newRoomPhotoUrl) {
        setRoomPhoto(newRoomPhotoUrl);
    }
};

  const handleSubmit = async () => {

    if (!roomName && !roomDesc && !roomFilter && !roomPublic) {
      Alert.alert('Room', 'No changes have been made');
      return;
    }

    if (roomName) {
      if (roomName.length < 3 || roomName.length > 20 || invalidChars.test(roomName) || filter.isProfane(roomName)) {
        Alert.alert('Room', 'Room Name should be between 3 - 20 characters, not contain special characters, and not contain profanity')
        return;
      }
      else {
        await changeRoomName(roomId, roomName);
      }
    }

    if (roomDesc) {
      if (roomDesc.length < 5 || roomDesc.length > 50 || invalidChars.test(roomDesc) || filter.isProfane(roomDesc)) {
        Alert.alert('Room', 'Room Description should be between 5 - 50 characters, not contain special characters, and not contain profanity')
        return;
      }
      else {
        await changeRoomDesc(roomId, roomDesc);
      }
    }

    if (roomFilter != originalRoomFilter) {
      await changeRoomFilter(roomId, roomFilter);
    }

    if (roomPublic != originalRoomPublic) {
      await changeRoomPublic(roomId, roomPublic);
    }

    else {
      Alert.alert('Room', "Changes saved");
    }
  }

  const handleDiscard = async () => {
    setRoomName("");
    setRoomDesc("");
    setRoomFilter(true);
    setRoomPublic(true);
    Alert.alert("Changes discarded", "All unsaved changes have been discarded.");
};

  return (
    <KeyboardAvoidingView style={darkMode ? ldStyles.screenD : ldStyles.screenL} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={ldStyles.container2}>
                    <View style={styles.centered}>
                        <Image style={styles.profileImageProfilePage} source={{ uri: roomPhoto || defaultProfilePicture }} />
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
                            placeholder={roomName}
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
                            placeholder={roomDesc}
                            placeholderTextColor={'gray'}
                            autoCapitalize="none"
                            keyboardAppearance={darkMode ? 'dark' : 'light'}
                        />
                    </View>

                    <View style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <Ionicons name={roomFilter ? "ear-outline" : "ear"} size={hp(2.7)} color="gray" />
                        <Text style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}>
                            {roomFilter ? 'Profanity Filter On' : 'Profanity Filter Off'}
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
                            {roomPublic ? 'Public' : 'Private'}
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
                        <TouchableOpacity onPress={handleSubmit} style={styles.submitDiscardButtonProfilePage}>
                            <Text style={styles.loginButtonText}>Submit</Text>
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
