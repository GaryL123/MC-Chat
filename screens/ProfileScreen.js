import React from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Platform
} from 'react-native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../assets/styles/AppStyles';
import { blurhash } from '../logic/commonLogic';
import profileLogic from '../logic/profileLogic';

export default function ProfileScreen() {
    const { user } = profileLogic();

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
                        <TouchableOpacity style={styles.editButton} onPress={{/*handleImageEdit*/}}>
                            <Octicons name="pencil" size={24} color="#737373" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.headerText}>{user?.fName + ' ' + user?.lName}</Text>

                    <View style={styles.inputContainerHoriz}>
                        <View style={[styles.inputContainer, { flex: 1, marginRight: 5 }]}>
                            <Octicons name="pencil" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={{/*setFirstName*/ }}
                                style={styles.input}
                                placeholder={user?.fName}
                                placeholderTextColor={'gray'}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={[styles.inputContainer, { flex: 1, marginLeft: 5 }]}>
                            <Octicons name="pencil" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={{/*setLastName*/ }}
                                style={styles.input}
                                placeholder={user?.lName}
                                placeholderTextColor={'gray'}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Octicons name="mail" size={hp(2.7)} color="gray" />
                        <TextInput
                            onChangeText={{/*setEmail*/ }}
                            style={styles.input}
                            placeholder={user?.email.split('@')[0]}
                            placeholderTextColor={'gray'}
                            autoCapitalize="none"
                        />
                        <Text style={styles.emailDomain}>@manhattan.edu</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Octicons name="lock" size={hp(2.7)} color="gray" />
                        <TextInput
                            onChangeText={{/*setPassword*/ }}
                            style={styles.input}
                            placeholder='Password'
                            secureTextEntry
                            placeholderTextColor={'gray'}
                            textContentType="oneTimeCode"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Octicons name="lock" size={hp(2.7)} color="gray" />
                        <TextInput
                            onChangeText={{/*setPassword*/ }}
                            style={styles.input}
                            placeholder='Confirm Password'
                            secureTextEntry
                            placeholderTextColor={'gray'}
                            textContentType="oneTimeCode"
                        />
                    </View>

                    <View style={styles.inputContainerHoriz}>
                        <TouchableOpacity onPress={{/*handleLogin*/ }} style={styles.submitDiscardButtonProfilePage}>
                            <Text style={styles.loginButtonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={{/*handleLogin*/ }} style={styles.submitDiscardButtonProfilePage}>
                            <Text style={styles.loginButtonText}>Discard</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
