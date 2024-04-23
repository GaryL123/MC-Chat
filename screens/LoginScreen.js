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
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from '../assets/styles/AppStyles';
import ldStyles from '../assets/styles/LightDarkStyles';

function LoginScreen() {
  const navigation = useNavigation();
  const [emailPrefix, setEmailPrefix] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailPrefix || !password) {
      Alert.alert('Login Error', "Please fill all the fields!");
      return;
    }

    // Validate email prefix
    if (emailPrefix.includes('@') || !/^[a-zA-Z0-9_.-]+$/.test(emailPrefix)) {
      Alert.alert('Invalid Email', "Your email should not contain '@' or special characters.");
      return;
    }

    const email = `${emailPrefix}@manhattan.edu`;

    setLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in with:', userCredentials.user.email);
      setLoading(false);
      // navigation.navigate('Home'); // Navigate to home screen or next screen
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Error', error.message);
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

          <Text style={styles.headerText}>Sign In</Text>

            <View style={styles.inputContainer}>
              <Octicons name="mail" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={setEmailPrefix}
                style={styles.input}
                placeholder='Email Address'
                placeholderTextColor={'gray'}
                autoCapitalize="none"
              />
              <Text style={styles.emailDomain}>@manhattan.edu</Text>
            </View>

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

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            {loading ? (
              <View style={styles.centered}>
                {/* Loading component or activity indicator */}
              </View>
            ) : (
              <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Sign In</Text>
              </TouchableOpacity>
            )}

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
