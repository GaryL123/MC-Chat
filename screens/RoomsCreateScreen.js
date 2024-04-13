import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../assets/styles/AppStyles';
import { blurhash } from '../logic/commonLogic';
import profileLogic from '../logic/profileLogic';

export default function RoomsCreateScreen() {
    const [roomName, setRoomName] = useState('');
    const [roomDesc, setRoomDesc] = useState('');
    const [roomPublic, setRoomPublic] = useState('');

    const handleChangeRoomPicture = async () => {
        await changeRoomPicture();
    };

    const handleCreate = async () => {
        
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
                        <TouchableOpacity style={styles.editButton} onPress={{handleChangeRoomPicture}}>
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
