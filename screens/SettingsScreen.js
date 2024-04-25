import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Modal } from 'react-native';
import { useSettings } from '../logic/settingsContext';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import translations from '../assets/styles/Translations';
import { getldStyles } from '../assets/styles/LightDarkStyles';

export default function SettingsScreen() {
    const { language, languages, changeLanguage, darkMode, toggleDarkMode, profanityFilter, toggleProfanityFilter, textSize, setTextSize } = useSettings();
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const t = (key) => translations[key][language] || translations[key]['English'];
    const ldStyles = getldStyles(textSize);

    const handleIncreaseTextSize = () => {
        setTextSize(textSize + 1);
    };

    const handleDecreaseTextSize = () => {
        setTextSize(textSize - 1);
    };

    return (
        <KeyboardAvoidingView style={[darkMode ? ldStyles.screenD : ldStyles.screenL]} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={ldStyles.container}>

                    <TouchableOpacity onPress={() => setShowLanguageModal(true)} style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <Ionicons name={"language-outline"} size={hp(2.7)} color="gray" />
                        <Text style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL]}>
                            {language}
                        </Text>
                        <Ionicons color="gray" name="chevron-forward-outline" size={20} />
                    </TouchableOpacity>

                    <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L]}>
                        <Ionicons name={darkMode ? "flashlight" : "flashlight-outline"} size={hp(2.7)} color="gray" />
                        <Text style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL]}>
                            {darkMode ? t("Dark Mode") : t("Light Mode")}
                        </Text>
                        <Switch onValueChange={toggleDarkMode} value={darkMode} />
                    </View>

                    <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L]}>
                        <Ionicons name={profanityFilter ? "ear-outline" : "ear"} size={hp(2.7)} color="gray" />
                        <Text style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL]}>
                            {profanityFilter ? t("Profanity Filter On") : t("Profanity Filter Off")}
                        </Text>
                        <Switch onValueChange={toggleProfanityFilter} value={profanityFilter} />
                    </View>

                    <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L]}>
                        <Ionicons name={"text"} size={hp(2.7)} color="gray" />
                        <Text style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL]}>
                            {t("Text Size")}
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleDecreaseTextSize} style={styles.button}>
                                <Text style={styles.buttonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={[styles.counter, darkMode ? styles.darkModeCounter : null]}>{textSize}</Text>
                            <TouchableOpacity onPress={handleIncreaseTextSize} style={styles.button}>
                                <Text style={styles.buttonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Modal animationType="none" transparent={true} visible={showLanguageModal} onRequestClose={() => setShowLanguageModal(false)}>
                        <View style={[darkMode ? ldStyles.modalContainerD : ldStyles.modalContainerL]}>
                            <View style={[darkMode ? ldStyles.modalContentD : ldStyles.modalContentL]}>
                                <Text style={[darkMode ? ldStyles.modalTitleD : ldStyles.modalTitleL]}>{t("Select Language")}</Text>
                                {languages.map((language, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={ldStyles.modalItem}
                                        onPress={() => {
                                            changeLanguage(language);
                                            setShowLanguageModal(false);
                                        }}>
                                        <Text style={[darkMode ? ldStyles.modalItemTextD : ldStyles.modalItemTextL]}>{language}</Text>
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

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    button: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
    },
    counter: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    darkModeCounter: {
        color: 'white',
    },
});
