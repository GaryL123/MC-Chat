import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, StyleSheet, Modal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { defaultProfilePicture } from '../logic/commonLogic';
import { useRoute } from '@react-navigation/native';
import { useSettings } from '../logic/settingsContext';
import directoryRoomsLogic from '../logic/directoryRoomsLogic';
import ldStyles from '../assets/styles/LightDarkStyles';

export default function RoomsAddUserScreen() {
    const { language, darkMode, textSize } = useSettings();
    const navigation = useNavigation();
    const route = useRoute();  // Access route object
    const { roomId } = route.params;  // Destructure roomId from route parameters
    const { fetchMembers, getOrganizedUsers, sendRoomInvite, isMember, sentRoomInvites } = directoryRoomsLogic();
    const { otherUsersList } = getOrganizedUsers();

    useEffect(() => {
        fetchMembers(roomId);
    }, [roomId]);

    const handleInvite = async (userId) => {
        await sendRoomInvite(userId, roomId);
    };

    const renderUserItem = ({ item }) => {
        const isInvited = sentRoomInvites.includes(item.id);
        const buttonLabel = isInvited ? "Sent" : "Invite";
        const buttonColor = isInvited ? "#cccccc" : "green";

        return (
            <View style={styles.userItemContainer}>
                <View style={styles.userInfoContainer}>
                    <Image style={styles.profileImage} source={{ uri: item?.photoURL || defaultProfilePicture }} />
                    <Text style={styles.emailText}>{item.fName + ' ' + item.lName}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleInvite(item.id)}
                    disabled={isInvited}
                    style={[styles.inviteButton, { backgroundColor: buttonColor }]}
                >
                    <Text style={styles.inviteButtonText}>{buttonLabel}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.screen}>
            <StatusBar style="dark-content" />
            <FlatList
                data={otherUsersList}
                keyExtractor={item => item.id.toString()}
                renderItem={renderUserItem}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
    sectionHeader: {
        backgroundColor: 'lightgray',
        paddingVertical: 4,
        paddingHorizontal: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    userItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: hp(1),
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        height: hp(6),
        width: hp(6),
        borderRadius: 100,
    },
    emailText: {
        marginLeft: wp(4),
        fontSize: hp(2.0),
        color: 'black',
    },
    inviteButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'green',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    friendButtonAdd: {
        backgroundColor: 'green',
    },
    friendButtonFriend: {
        backgroundColor: '#166939',
    },
    friendButtonSent: {
        backgroundColor: 'gray',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    modalButtonCancel: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    modalButtonText: {
        color: 'white',
    },
    inviteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
