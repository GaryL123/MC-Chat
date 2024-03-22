import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';

export default function ForgotPassword() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();

    const emailRef = useRef("");

    const handleResetPassword = async () => {
        if (!emailRef.current) {
            Alert.alert('Forgot Password', "Please enter your email address!");
            return;
        }

        setLoading(true);
        const response = await resetPassword(emailRef.current);
        setLoading(false);

        if (!response.success) {
            Alert.alert('Forgot Password', response.msg);
        } else {
            // Maybe navigate to a confirmation screen or show a success message
            Alert.alert('Success', 'Check your email to reset your password.');
        }
    }
    return (
        <CustomKeyboardView>
            <StatusBar style="dark" />
            <View style={{ paddingTop: hp(10), paddingHorizontal: wp(5) }} className="flex-1 gap-12">
                {/* signIn image */}
                <View className="items-center">
                    <Image style={{ height: hp(25) }} resizeMode='contain' source={require('../assets/images/MCChat_Color_512px.png')} />
                </View>


                <View className="gap-10">
                    <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">Forgot Password</Text>
                    {/* inputs */}
                    <View className="gap-4">
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                            <Octicons name="mail" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={(value) => emailRef.current = value + '@manhattan.edu'}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder='Email Address'
                                placeholderTextColor={'gray'}
                            />
                            <Text style={{ fontSize: hp(2), color: '#6B7280' }}>@manhattan.edu</Text>
                        </View>

                        {/* submit button */}

                        <View>
                            {
                                loading ? (
                                    <View className="flex-row justify-center">
                                        <Loading size={hp(6.5)} />
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={handleResetPassword} style={{ height: hp(6.5), backgroundColor: '#166939' }} className="rounded-xl justify-center items-center">
                                        <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                                            Reset Password
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                        <View className="flex-row justify-center">
                            <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">Remembered your password? </Text>
                            <Pressable onPress={() => router.push('signIn')}>
                                <Text style={{ fontSize: hp(1.8), color: '#166939' }} className="font-bold">Sign In</Text>
                            </Pressable>

                        </View>
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
    )
}
