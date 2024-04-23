import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Platform
  } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../logic/authContext';
import styles from '../assets/styles/AppStyles';
import ldStyles from '../assets/styles/LightDarkStyles';

function RegistrationScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailPrefix, setEmailPrefix] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!firstName || !lastName || !emailPrefix || !password || !confirmPassword) {
        Alert.alert('Registration Error', "Please fill all the fields!");
        return;
    }

    if (emailPrefix.includes('@') || !/^[a-zA-Z0-9_.-]+$/.test(emailPrefix)) {
        Alert.alert('Invalid Email', "Please enter only the first part of your email before '@manhattan.edu'.");
        return;
    }

    if (password !== confirmPassword) {
        Alert.alert('Password Error', "Passwords don't match. Please try again.");
        return;
    }

    const email = `${emailPrefix}@manhattan.edu`;

    try {
        const result = await register(email, firstName, lastName, password);
        if (!result.success) {
          Alert.alert('Registration Error', result.msg);
        }
    } catch (error) {
        Alert.alert('Registration Error', error.message);
    }
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
                <Image style={styles.logo} resizeMode='contain' source={require('../assets/MCChat_Color_512px.png')} />
            </View>

            <Text style={styles.headerText}>Register</Text>

            {/* First Name */}
            <View style={styles.inputContainer}>
                <Octicons name="person" size={hp(2.7)} color="gray" />
                <TextInput
                onChangeText={setFirstName}
                style={styles.input}
                placeholder='First Name'
                placeholderTextColor={'gray'}
                />
            </View>

            {/* Last Name */}
            <View style={styles.inputContainer}>
                <Octicons name="person" size={hp(2.7)} color="gray" />
                <TextInput
                onChangeText={setLastName}
                style={styles.input}
                placeholder='Last Name'
                placeholderTextColor={'gray'}
                />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
                <Octicons name="mail" size={hp(2.7)} color="gray" />
                <TextInput
                onChangeText={setEmailPrefix}
                style={styles.input}
                placeholder='Email'
                placeholderTextColor={'gray'}
                autoCapitalize="none"
                />
                <Text style={styles.emailDomain}>@manhattan.edu</Text>
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
                <Octicons name="lock" size={hp(2.7)} color="gray" />
                <TextInput
                onChangeText={setPassword}
                style={styles.input}
                placeholder='Password'
                secureTextEntry
                placeholderTextColor={'gray'}
                textContentType="oneTimeCode"
                />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
                <Octicons name="lock" size={hp(2.7)} color="gray" />
                <TextInput
                onChangeText={setConfirmPassword}
                style={styles.input}
                placeholder='Confirm Password'
                secureTextEntry
                placeholderTextColor={'gray'}
                textContentType="oneTimeCode"
                />
            </View>

            <TouchableOpacity onPress={handleRegister} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Register</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.registerLink}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

  );
}

export default RegistrationScreen;
