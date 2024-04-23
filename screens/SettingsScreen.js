import React, { useState } from 'react';
import { View, Text, Switch, Button, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Modal } from 'react-native';
import Slider from '@react-native-community/slider';
import { useSettings } from '../logic/settingsContext';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from '../assets/styles/AppStyles';

export default function SettingsScreen() {
    const { language, languages, changeLanguage, darkMode, toggleDarkMode, profanityFilter, toggleProfanityFilter, textSize, setTextSize } = useSettings();
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: darkMode ? '#111111' : '#e6e6e6' }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>

                    <TouchableOpacity onPress={() => setShowLanguageModal(true)} style={styles.inputContainer}>
                        <Ionicons name={"language-outline"} size={hp(2.7)} color="gray" />
                        <Text style={{
                            flex: 1,
                            paddingHorizontal: 10,
                            paddingVertical: hp(1.5),
                            fontSize: hp(2),
                            color: '#333',
                            marginRight: 10
                        }}>
                            {language}
                        </Text>
                        <Ionicons color="gray" name="chevron-forward-outline" size={20} />
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        <Ionicons name={darkMode ? "flashlight" : "flashlight-outline"} size={hp(2.7)} color="gray" />
                        <Text style={{
                            flex: 1,
                            paddingHorizontal: 10,
                            paddingVertical: hp(1.5),
                            fontSize: hp(2),
                            color: '#333',
                            marginRight: 10  // Maintain spacing from the switch
                        }}>
                            {darkMode ? 'Dark Mode' : 'Light Mode'}
                        </Text>
                        <Switch onValueChange={toggleDarkMode} value={darkMode} />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name={profanityFilter ? "ear-outline" : "ear"} size={hp(2.7)} color="gray" />
                        <Text style={{
                            flex: 1,
                            paddingHorizontal: 10,
                            paddingVertical: hp(1.5),
                            fontSize: hp(2),
                            color: '#333',
                            marginRight: 10  // Maintain spacing from the switch
                        }}>
                            {profanityFilter ? 'Profanity Filter On' : 'Profanity Filter Off'}
                        </Text>
                        <Switch onValueChange={toggleProfanityFilter} value={profanityFilter} />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name={"text"} size={hp(2.7)} color="gray" />
                        <Text style={{
                            flex: 1,
                            paddingHorizontal: 10,
                            paddingVertical: hp(1.5),
                            fontSize: hp(2),
                            color: '#333',
                            marginRight: 10  // Maintain spacing from the switch
                        }}>
                            Text Size
                        </Text>
                        <Slider
                            style={{ flex: 2 }}
                            minimumValue={8}
                            maximumValue={32}
                            step={2}
                            value={textSize}
                            onValueChange={(value) => setTextSize(value)}
                        />
                    </View>

                    <Modal animationType="none" transparent={true} visible={showLanguageModal} onRequestClose={() => setShowLanguageModal(false)}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Language</Text>
                                {languages.map((language, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.modalItem}
                                        onPress={() => {
                                            changeLanguage(language);
                                            setShowLanguageModal(false);
                                        }}>
                                        <Text style={styles.modalItemText}>{language}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
