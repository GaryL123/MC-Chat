import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { defaultProfilePicture } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import profileLogic from '../logic/profileLogic';
import styles from '../assets/styles/AppStyles';
import ldStyles from '../assets/styles/LightDarkStyles';

export default function ProfileScreen() {
    const { language, darkMode, profanityFilter, textSize } = useSettings();
    const { user, chooseProfilePicture, changeProfilePicture, changeFName, changeLName, changeEmail, changePassword } = profileLogic();
    const [fName, setFName] = useState(user?.fName || "");
    const [lName, setLName] = useState(user?.lName || "");
    const [email, setEmail] = useState(user?.email.split('@')[0] || "");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const invalidChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    const handleChangeProfilePicture = async () => {
        await chooseProfilePicture();
    };

    const handleSubmit = async () => {
        const capitalizationNames = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        const capitalizationEmail = string => string.toLowerCase();

        if (!fName && !lName && !email && !password) {
            Alert.alert('Profile', 'No changes have been made');
            return;
        }

        if (fName) {
            if(fName.length < 2 || fName.length > 30 || invalidChars.test(fName)) {
                Alert.alert('Profile', 'First Name should be between 2 and 30 characters and not contain special characters')
                return;
            }
            else {
                await changeFName(capitalizationNames(fName));
            }
        }

        if (lName) {
            if(lName.length < 2 || lName.length > 30 || invalidChars.test(lName)) {
                Alert.alert('Profile', 'Last Name should be between 2 and 30 characters and not contain special characters')
                return;
            }
            else {
                await changeLName(capitalizationNames(lName));
            } 
        }

        if (email) {
            if (emailValue.includes('@')) {
                Alert.alert('Profile', "Please enter only first half of email before @manhattan.edu");
                return;
            }
            else {
                await changeEmail(capitalizationEmail(email));
            }
        }

        if (password) {
            if (passwordConfirm.current != password.current) {
                Alert.alert('Profile', "Passwords do not match");
                return;
            }
            else {
                await changePassword(password);
            }
        }

        else {
            Alert.alert('Profile', "Changes saved");
        }
    }

    const handleDiscard = () => {
        setFName(user?.fName || "");
        setLName(user?.lName || "");
        setEmail(user?.email.split('@')[0] || "");
        setPassword("");
        setPasswordConfirm("");
        Alert.alert("Changes discarded", "All unsaved changes have been discarded.");
    };

    return (
        <KeyboardAvoidingView style={darkMode ? ldStyles.screenD : ldStyles.screenL} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <View style={styles.centered}>
                        <Image style={styles.profileImageProfilePage} source={{ uri: user?.photoURL || defaultProfilePicture }} />
                        <TouchableOpacity style={darkMode ? ldStyles.editButtonD : ldStyles.editButtonL} onPress={handleChangeProfilePicture}>
                            <Octicons name="pencil" size={24} color="#737373" />
                        </TouchableOpacity>
                    </View>

                    <Text style={darkMode ? ldStyles.headerTextD : ldStyles.headerTextL}>{user?.fName + ' ' + user?.lName}</Text>

                    <View style={styles.inputContainerHoriz}>
                        <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L, { flex: 1, marginRight: 5 }]}>
                            <Octicons name="pencil" size={hp(2.7)} color="gray" />
                            <TextInput
                                value={fName} 
                                onChangeText={setFName}
                                style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}
                                placeholder={user?.fName}
                                placeholderTextColor={'gray'}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L, { flex: 1, marginRight: 5 }]}>
                            <Octicons name="pencil" size={hp(2.7)} color="gray" />
                            <TextInput
                                value={lName}
                                onChangeText={setLName}
                                style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}
                                placeholder={user?.lName}
                                placeholderTextColor={'gray'}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <Octicons name="mail" size={hp(2.7)} color="gray" />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}
                            placeholder={user?.email.split('@')[0]}
                            placeholderTextColor={'gray'}
                            autoCapitalize="none"
                        />
                        <Text style={darkMode ? ldStyles.emailDomainD : ldStyles.emailDomainL}>@manhattan.edu</Text>
                    </View>

                    <View style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <Octicons name="lock" size={hp(2.7)} color="gray" />
                        <TextInput
                            onChangeText={setPassword}
                            style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}
                            placeholder='Password'
                            secureTextEntry
                            placeholderTextColor={'gray'}
                            textContentType="oneTimeCode"
                        />
                    </View>

                    <View style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <Octicons name="lock" size={hp(2.7)} color="gray" />
                        <TextInput
                            onChangeText={setPasswordConfirm}
                            style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}
                            placeholder='Confirm Password'
                            secureTextEntry
                            placeholderTextColor={'gray'}
                            textContentType="oneTimeCode"
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
