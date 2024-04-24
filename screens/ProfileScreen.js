import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Switch, Platform, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Image } from 'expo-image';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons, FontAwesome6 } from '@expo/vector-icons';
import { filter, defaultProfilePicture, generateYears, currentYear, mcMajors, mcDepts, mcTitles } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import profileLogic from '../logic/profileLogic';
import styles from '../assets/styles/AppStyles';
import ldStyles from '../assets/styles/LightDarkStyles';

export default function ProfileScreen() {
    const { language, darkMode, profanityFilter, textSize } = useSettings();
    const { user, chooseProfilePicture, changeFName, changeLName, changeEmail, changeMajor, changeGradYear, changeFaculty, changeDept, changeTitle, changePassword } = profileLogic();
    const [fName, setFName] = useState(user?.fName || "");
    const [lName, setLName] = useState(user?.lName || "");
    const [email, setEmail] = useState(user?.email.split('@')[0] || "");
    const [major, setMajor] = useState(user?.major || "");
    const [showMajorPicker, setShowMajorPicker] = useState(false);
    const [gradYear, setGradYear] = useState(user?.gradYear || "");
    const [showGradYearPicker, setShowGradYearPicker] = useState(false);
    const gradYears = generateYears(1950, 2030);
    const [faculty, setFaculty] = useState(user?.faculty || false);
    const [originalFaculty, setOriginalFaculty] = useState(user?.faculty);
    const [dept, setDept] = useState(user?.dept || "");
    const [showDeptPicker, setShowDeptPicker] = useState(false);
    const [title, setTitle] = useState(user?.title || "");
    const [showTitlePicker, setShowTitlePicker] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const invalidChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    const handleChangeProfilePicture = async () => {
        await chooseProfilePicture();
    };

    const handleSubmit = async () => {
        const capitalizationNames = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        const capitalizationEmail = string => string.toLowerCase();

        if (!fName && !lName && !email && !major && !gradYear && !faculty && !password) {
            Alert.alert('Profile', 'No changes have been made');
            return;
        }

        if (fName) {
            if (fName.length < 2 || fName.length > 30 || invalidChars.test(fName) || filter.isProfane(fName)) {
                Alert.alert('Profile', 'First Name should be between 2 - 30 characters, not contain special characters, and not be profanity')
                return;
            }
            else {
                await changeFName(capitalizationNames(fName));
            }
        }

        if (lName) {
            if (lName.length < 2 || lName.length > 30 || invalidChars.test(lName) || filter.isProfane(lName)) {
                Alert.alert('Profile', 'Last Name should be between 2 - 30 characters, not contain special characters, and not be profanity')
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

        if (major) {
            await changeMajor(major);
        }

        if (gradYear) {
            await changeGradYear(gradYear);
        }

        if (faculty != originalFaculty) {
            await changeFaculty(faculty);
        }

        if (dept) {
            await changeDept(dept);
        }

        if (title) {
            await changeTitle(title);
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
        setMajor(user?.major || "");
        setGradYear(user?.gradYear || "");
        setPassword("");
        setPasswordConfirm("");
        Alert.alert("Changes discarded", "All unsaved changes have been discarded.");
    };

    return (
        <KeyboardAvoidingView style={darkMode ? ldStyles.screenD : ldStyles.screenL} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={ldStyles.container2}>
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
                                keyboardAppearance={darkMode ? 'dark' : 'light'}
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
                                keyboardAppearance={darkMode ? 'dark' : 'light'}
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
                            keyboardAppearance={darkMode ? 'dark' : 'light'}
                        />
                        <Text style={darkMode ? ldStyles.emailDomainD : ldStyles.emailDomainL}>@manhattan.edu</Text>
                    </View>

                    <View style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <FontAwesome6 name={faculty ? "person-harassing" : "person-drowning"} size={hp(2.7)} color="gray" />
                        <Text style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}>
                            {faculty ? 'Faculty' : 'Student'}
                        </Text>
                        <Switch
                            onValueChange={() => {setFaculty(previousState => !previousState), setMajor(user?.major || ""), setGradYear(user?.gradYear || ""), setDept(user?.dept || ""), setTitle(user?.title || "")}}
                            value={faculty}
                        />
                    </View>

                    {!faculty ? (
                        <View style={styles.inputContainerHoriz}>
                            <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L, { flex: 1, marginRight: 5 }]}>
                                <TouchableOpacity onPress={() => setShowMajorPicker(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}>{major || "Major"}</Text>
                                    <Octicons name="chevron-down" size={24} color="gray" />
                                </TouchableOpacity>
                                <Modal animationType="none" transparent={true} visible={showMajorPicker} onRequestClose={() => setShowMajorPicker(false)}>
                                    <View style={darkMode ? ldStyles.modalContainerD : ldStyles.modalContainerL}>
                                        <View style={darkMode ? ldStyles.modalContentD : ldStyles.modalContentL}>
                                            <Text style={darkMode ? ldStyles.modalTitleD : ldStyles.modalTitleL}>Select Major</Text>
                                            <Picker
                                                selectedValue={major}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    setMajor(itemValue);
                                                    setShowMajorPicker(false);
                                                }}
                                                itemStyle={{
                                                    color: darkMode ? '#f1f1f1' : '#333333'
                                                }}
                                            >
                                                {mcMajors.map((major, index) => (
                                                    <Picker.Item key={index} label={major} value={major} />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>
                                </Modal>
                            </View>

                            <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L, { flex: 1, marginRight: 5 }]}>
                                <TouchableOpacity onPress={() => setShowGradYearPicker(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}>{gradYear || "Grad. Year"}</Text>
                                    <Octicons name="chevron-down" size={24} color="gray" />
                                </TouchableOpacity>
                                <Modal animationType="none" transparent={true} visible={showGradYearPicker} onRequestClose={() => setShowGradYearPicker(false)}>
                                    <View style={darkMode ? ldStyles.modalContainerD : ldStyles.modalContainerL}>
                                        <View style={darkMode ? ldStyles.modalContentD : ldStyles.modalContentL}>
                                            <Text style={darkMode ? ldStyles.modalTitleD : ldStyles.modalTitleL}>Select Graduation Year</Text>
                                            <Picker
                                                selectedValue={gradYear || currentYear}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    setGradYear(itemValue);
                                                    setShowGradYearPicker(false);
                                                }}
                                                itemStyle={{
                                                    color: darkMode ? '#f1f1f1' : '#333333'
                                                }}
                                            >
                                                {gradYears.map((gradYear, index) => (
                                                    <Picker.Item key={index} label={gradYear} value={gradYear} />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.inputContainerHoriz}>
                            <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L, { flex: 1, marginRight: 5 }]}>
                                <TouchableOpacity onPress={() => setShowDeptPicker(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}>{dept || "Department"}</Text>
                                    <Octicons name="chevron-down" size={24} color="gray" />
                                </TouchableOpacity>
                                <Modal animationType="none" transparent={true} visible={showDeptPicker} onRequestClose={() => setShowDeptPicker(false)}>
                                    <View style={darkMode ? ldStyles.modalContainerD : ldStyles.modalContainerL}>
                                        <View style={darkMode ? ldStyles.modalContentD : ldStyles.modalContentL}>
                                            <Text style={darkMode ? ldStyles.modalTitleD : ldStyles.modalTitleL}>Select Department</Text>
                                            <Picker
                                                selectedValue={dept}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    setDept(itemValue);
                                                    setShowDeptPicker(false);
                                                }}
                                                itemStyle={{
                                                    color: darkMode ? '#f1f1f1' : '#333333'
                                                }}
                                            >
                                                {mcDepts.map((dept, index) => (
                                                    <Picker.Item key={index} label={dept} value={dept} />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>
                                </Modal>
                            </View>

                            <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L, { flex: 1, marginRight: 5 }]}>
                                <TouchableOpacity onPress={() => setShowTitlePicker(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}>{title || "Title"}</Text>
                                    <Octicons name="chevron-down" size={24} color="gray" />
                                </TouchableOpacity>
                                <Modal animationType="none" transparent={true} visible={showTitlePicker} onRequestClose={() => setShowTitlePicker(false)}>
                                    <View style={darkMode ? ldStyles.modalContainerD : ldStyles.modalContainerL}>
                                        <View style={darkMode ? ldStyles.modalContentD : ldStyles.modalContentL}>
                                            <Text style={darkMode ? ldStyles.modalTitleD : ldStyles.modalTitleL}>Select Title</Text>
                                            <Picker
                                                selectedValue={title}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    setTitle(itemValue);
                                                    setShowTitlePicker(false);
                                                }}
                                                itemStyle={{
                                                    color: darkMode ? '#f1f1f1' : '#333333'
                                                }}
                                            >
                                                {mcTitles.map((title, index) => (
                                                    <Picker.Item key={index} label={title} value={title} />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                        </View>
                    )}

                    <View style={darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L}>
                        <Octicons name="lock" size={hp(2.7)} color="gray" />
                        <TextInput
                            onChangeText={setPassword}
                            style={darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL}
                            placeholder='Password'
                            secureTextEntry
                            placeholderTextColor={'gray'}
                            textContentType="oneTimeCode"
                            keyboardAppearance={darkMode ? 'dark' : 'light'}
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
                            keyboardAppearance={darkMode ? 'dark' : 'light'}
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