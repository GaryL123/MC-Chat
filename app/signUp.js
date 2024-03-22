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
    const fNameRef = useRef("");
    const lNameRef = useRef("");
    const passwordRef = useRef("");
    const passwordConfirmRef = useRef("");
    const invalidChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    const handleRegister = async () => {
        if (!emailRef.current || !fNameRef.current || !lNameRef.current || !passwordRef.current) {
            Alert.alert('Sign Up', "Please fill all the fields!");
            return;
        }

        if (emailRef.current.includes('@')) {
            Alert.alert('Sign Up', "Please enter only first half of email before @manhattan.edu");
            return;
        }

        if(fNameRef.current.length < 2 || fNameRef.current.length > 30) {
            Alert.alert('Sign Up', 'First Name should be between 2 and 30 characters')
            return;
        }

        if(lNameRef.current.length < 2 || lNameRef.current.length > 30) {
            Alert.alert('Sign Up', 'Last Name should be between 2 and 30 characters')
            return;
        }

        if(invalidChars.test(fNameRef.current)) {
            Alert.alert('Sign Up', 'First Name should not contain any special characters')
            return;
        }

        if(invalidChars.test(lNameRef.current)) {
            Alert.alert('Sign Up', 'Last Name should not contain any special characters')
            return;
        }

        if (passwordConfirmRef.current != passwordRef.current) {
            Alert.alert('Sign Up', "Passwords do not match");
            return;
        }

        setLoading(true);

        const capitalizationEmail = string => string.toLowerCase();
        const capitalizationNames = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

        let response = await register(capitalizationEmail(emailRef.current + '@manhattan.edu'), capitalizationNames(fNameRef.current), capitalizationNames(lNameRef.current), passwordRef.current);
        setLoading(false);

        console.log('got result: ', response);
        if (!response.success) {
            Alert.alert('Sign Up', response.msg);
        }
    }
    return (
        <CustomKeyboardView>
            <StatusBar style="dark" />
            <View style={{ paddingTop: hp(10), paddingHorizontal: wp(5) }} className="flex-1 gap-7">
                {/* signIn image */}
                <View className="items-center">
                    <Image style={{ height: hp(20) }} resizeMode='contain' source={require('../assets/images/MCChat_Color_512px.png')} />
                </View>


                <View className="gap-7">
                    <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">Sign Up</Text>
                    {/* inputs */}
                    <View className="gap-3">
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
                            <Octicons name="dot" size={hp(3.5)} color="gray" />
                            <TextInput
                                onChangeText={(value) => fNameRef.current = value}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder='First Name'
                                placeholderTextColor={'gray'}
                            />
                        </View>
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                            <Octicons name="dot" size={hp(3.5)} color="gray" />
                            <TextInput
                                onChangeText={(value) => lNameRef.current = value}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder='Last Name'
                                placeholderTextColor={'gray'}
                            />
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
