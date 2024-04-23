import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import styles from '../assets/styles/AppStyles';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import ldStyles from '../assets/styles/LightDarkStyles';

function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [emailPrefix, setEmailPrefix] = useState('');
  const [loading, setLoading] = useState(false);

  const email = `${emailPrefix}@manhattan.edu`;
  const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, msg: 'Password reset email sent.' };
    } catch (e) {
        let msg = e.message;
        if (msg.includes('auth/invalid-email')) msg = 'Invalid email';
        if (msg.includes('auth/user-not-found')) msg = 'No user found with this email';
        return { success: false, msg };
    }
  }
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Forgot Password', "Please enter your email address!");
      return;
    }

    setLoading(true);
    const response = await resetPassword(email);
    setLoading(false);
    if(!response.success){
        Alert.alert('Forgot Password', response.msg);
    }
    else{
        Alert.alert('Success', 'Check your email to reset your password.');
        navigation.navigate('Login'); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        <Image style={styles.logo} resizeMode='contain' source={require('../assets/MCChat_Color_512px.png')} />
      </View>

      <Text style={styles.headerText}>Forgot Password</Text>

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

      {loading ? (
        <View style={styles.centered}>
          {/* Loading indicator or component */}
        </View>
      ) : (
        <TouchableOpacity onPress={handleResetPassword} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Reset Password</Text>
        </TouchableOpacity>
      )}

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Remembered your password? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.registerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ForgotPasswordScreen;
