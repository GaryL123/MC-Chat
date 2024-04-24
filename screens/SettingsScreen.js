import React, { useState } from 'react';
import { View, Text, Switch, Button, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Modal } from 'react-native';
import Slider from '@react-native-community/slider';
import { useSettings } from '../logic/settingsContext';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from '../assets/styles/AppStyles';
import ldStyles from '../assets/styles/LightDarkStyles';

export default function SettingsScreen() {
    const { language, languages, changeLanguage, darkMode, toggleDarkMode, profanityFilter, toggleProfanityFilter, textSize, setTextSize } = useSettings();
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    return (
        <KeyboardAvoidingView style={[darkMode ? ldStyles.screenD : ldStyles.screenL , { fontSize: textSize }]} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={ldStyles.container}>

                    <TouchableOpacity onPress={() => setShowLanguageModal(true)} style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <Ionicons name={"language-outline"} size={hp(2.7)} color="gray" />
                        <Text style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL, { fontSize: textSize }]}>
                            {language}
                        </Text>
                        <Ionicons color="gray" name="chevron-forward-outline" size={20} />
                    </TouchableOpacity>

                    <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L, { fontSize: textSize }]}>
                        <Ionicons name={darkMode ? "flashlight" : "flashlight-outline"} size={hp(2.7)} color="gray" />
                        <Text style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL, { fontSize: textSize }]}>
                            {darkMode ? 'Dark Mode' : 'Light Mode'}
                        </Text>
                        <Switch onValueChange={toggleDarkMode} value={darkMode} />
                    </View>

                    <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L, { fontSize: textSize }]}>
                        <Ionicons name={profanityFilter ? "ear-outline" : "ear"} size={hp(2.7)} color="gray" />
                        <Text style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL, { fontSize: textSize }]}>
                            {profanityFilter ? 'Profanity Filter On' : 'Profanity Filter Off'}
                        </Text>
                        <Switch onValueChange={toggleProfanityFilter} value={profanityFilter} />
                    </View>

                    <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L, { fontSize: textSize }]}>
                        <Ionicons name={"text"} size={hp(2.7)} color="gray" />
                        <Text style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL, { fontSize: textSize }]}>
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
                        <View style={[darkMode ? ldStyles.modalContainerD : ldStyles.modalContainerL, { fontSize: textSize }]}>
                            <View style={[darkMode ? ldStyles.modalContentD : ldStyles.modalContentL, { fontSize: textSize }]}>
                                <Text style={[darkMode ? ldStyles.modalTitleD : ldStyles.modalTitleL, { fontSize: textSize }]}>Select Language</Text>
                                {languages.map((language, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.modalItem}
                                        onPress={() => {
                                            changeLanguage(language);
                                            setShowLanguageModal(false);
                                        }}>
                                        <Text style={[darkMode ? ldStyles.modalItemTextD : ldStyles.modalItemTextL, { fontSize: textSize }]}>{language}</Text>
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
