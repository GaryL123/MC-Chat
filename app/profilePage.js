import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';

export default function ProfilePage() {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const saveProfile = async () => {
        setLoading(true);
        try {
            // Implement logic to save data to backend
            // For example, you can use an API call to update user information
            // await updateUserProfile(user.userId, { name, email });
            setEditing(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomKeyboardView>
            <StatusBar style="dark" />
            <View style={{ paddingTop: hp(10), paddingHorizontal: wp(5) }}>
                <TouchableOpacity onPress={() => setEditing(true)} style={{ alignItems: 'flex-end' }}>
                    <Octicons name="pencil" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Image style={{ height: hp(25) }} resizeMode="contain" source={{ uri: user.profilePicture }} />
                </View>
                <View>
                    <Text style={{ fontSize: hp(4), fontWeight: 'bold', textAlign: 'center', marginTop: hp(2) }}>Profile</Text>
                    {editing ? (
                        <View style={{ marginTop: hp(2) }}>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Name"
                                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
                            />
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Email"
                                style={{ borderWidth: 1, padding: 10 }}
                            />
                            <TouchableOpacity onPress={saveProfile} style={{ padding: 10, backgroundColor: 'blue', marginTop: 20 }}>
                                <Text style={{ color: 'white', textAlign: 'center' }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ marginTop: hp(2) }}>
                            <Text style={{ fontSize: hp(4) }}>Name: {user.name}</Text>
                            <Text style={{ fontSize: hp(2) }}>Email: {user.email}</Text>
                        </View>
                    )}
                </View>
            </View>
        </CustomKeyboardView>
    );
}
