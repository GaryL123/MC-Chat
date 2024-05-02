import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useSettings } from '../logic/settingsContext';
import translations from '../assets/styles/Translations';
import styles from '../assets/styles/AppStyles';
import { getldStyles } from '../assets/styles/LightDarkStyles';

// Constants for account lockout and timer management
const MAX_LOGIN_ATTEMPTS = 5; // Maximum number of failed login attempts before lockout
const LOCKOUT_DURATION = 60 * 60 * 1000; // Lockout duration in milliseconds (60 minutes)

function LoginScreen() {
  const { language, darkMode, profanityFilter, textSize } = useSettings();
  const navigation = useNavigation();
  const [emailPrefix, setEmailPrefix] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0); // State to track login attempts
  const [lockoutTime, setLockoutTime] = useState(null); // State to track lockout duration
  const t = (key) => translations[key][language] || translations[key]['English'];
  const ldStyles = getldStyles(textSize);

  useEffect(() => {
    if (lockoutTime) {
      const timerId = setTimeout(() => {
        setLockoutTime(null);
      }, lockoutTime - Date.now());
      return () => clearTimeout(timerId);
    }
  }, [lockoutTime]);

  const handleLogin = async () => {
    if (!emailPrefix || !password) {
      Alert.alert('Login Error', "Please fill all the fields!");
      return;
    }

    if (emailPrefix.includes('@') || !/^[a-zA-Z0-9_.-]+$/.test(emailPrefix)) {
      Alert.alert('Invalid Email', "Your email should not contain '@' or special characters.");
      return;
    }

    const email = `${emailPrefix}@manhattan.edu`;

    setLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      setLoginAttempts(0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        Alert.alert('Login Error', 'Invalid email or password.');
      } else {
        setLoginAttempts(loginAttempts + 1);
        if (loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
          await lockAccount();
          return;
        }
        Alert.alert('Login Error', error.message);
      }
    }
  };

  const lockAccount = async () => {
    Alert.alert('Account Locked', 'Your account has been locked due to multiple failed login attempts.');
    setLockoutTime(Date.now() + LOCKOUT_DURATION);
  };

  return (
    <KeyboardAvoidingView
      style={[darkMode ? ldStyles.screenD : ldStyles.screenL]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.centered}>
            <Image style={styles.logo} resizeMode='contain' source={darkMode ? require('../assets/MCChat_Dark_512px.png') : require('../assets/MCChat_Color_512px.png')} />
          </View>

          <Text style={[darkMode ? ldStyles.headerTextD : ldStyles.headerTextL]}>{t("Sign In")}</Text>

            <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L]}>
              <Octicons name="mail" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={setEmailPrefix}
                style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL]}
                placeholder={t("Email Address")}
                placeholderTextColor={'gray'}
                autoCapitalize="none"
                keyboardAppearance={darkMode ? 'dark' : 'light'}
              />
              <Text style={[darkMode ? ldStyles.emailDomainD : ldStyles.emailDomainL]}>@manhattan.edu</Text>
            </View>

            <View style={[darkMode ? ldStyles.itemContainer2D : ldStyles.itemContainer2L]}>
              <Octicons name="lock" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={setPassword}
                style={[darkMode ? ldStyles.itemContainer2TextD : ldStyles.itemContainer2TextL]}
                placeholder={t("Password")}
                secureTextEntry
                placeholderTextColor={'gray'}
                textContentType="oneTimeCode"
                keyboardAppearance={darkMode ? 'dark' : 'light'}
              />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>{t("Forgot Password")}?</Text>
            </TouchableOpacity>

            {!lockoutTime && ( 
              loading ? (
                <View style={styles.centered}>
                </View>
              ) : (
                <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>{t("Sign In")}</Text>
                </TouchableOpacity>
              )
            )}

            {lockoutTime && ( 
              <View style={styles.centered}>
                <Text style={[darkMode? ldStyles.nameTextD : ldStyles.nameTextL]}>Your account is locked. Please try again later.</Text>
              </View>
            )}

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>{t("Don't have an account")}? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>{t("Sign Up")}</Text>
              </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
