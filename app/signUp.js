import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';

export default function SignUp() {
    const router = useRouter();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);

    const emailRef = useRef("");
    const passwordRef = useRef("");
    const passwordConfirmRef = useRef("");
    const usernameRef = useRef("");
    const profileRef = useRef("");

    const handleRegister = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Sign Up', "Please fill all the fields!");
            return;
        }

        if (emailRef.current.includes('@')) {
            Alert.alert('Sign Up', "Please enter only first half of email before @manhattan.edu");
            return;
        }

        if (passwordConfirmRef.current != passwordRef.current) {
            Alert.alert('Sign Up', "Passwords do not match");
            return;
        }

        setLoading(true);

        let response = await register((emailRef.current + '@manhattan.edu'), passwordRef.current);
        setLoading(false);

        console.log('got result: ', response);
        if (!response.success) {
            Alert.alert('Sign Up', response.msg);
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
                    <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">Sign Up</Text>
                    {/* inputs */}
                    <View className="gap-4">
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                            <Octicons name="mail" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={(value) => emailRef.current = value}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder='Email Address'
                                placeholderTextColor={'gray'}
                            />
                            <Text style={{ fontSize: hp(2), color: '#6B7280' }}>@manhattan.edu</Text>
                        </View>
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                            <Octicons name="lock" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={value => passwordRef.current = value}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder='Password'
                                secureTextEntry
                                placeholderTextColor={'gray'}
                            />
                        </View>

                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                            <Feather name="lock" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={value => passwordConfirmRef.current = value}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder='Confirm Password'
                                secureTextEntry
                                placeholderTextColor={'gray'}
                            />
                        </View>


                        {/* submit button */}

                        <View>
                            {
                                loading ? (
                                    <View className="flex-row justify-center">
                                        <Loading size={hp(6.5)} />
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={handleRegister} style={{ height: hp(6.5), backgroundColor: '#166939' }} className="rounded-xl justify-center items-center">
                                        <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                                            Sign Up
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>



                        {/* sign up text */}

                        <View className="flex-row justify-center">
                            <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">Already have an account? </Text>
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
