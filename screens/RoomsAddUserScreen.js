import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { defaultProfilePicture } from '../logic/commonLogic';
import { useRoute } from '@react-navigation/native';
import { useSettings } from '../logic/settingsContext';
import directoryRoomsLogic from '../logic/directoryRoomsLogic';
import ldStyles from '../assets/styles/LightDarkStyles';

export default function RoomsAddUserScreen() {
    const { language, darkMode, textSize } = useSettings();
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
        const buttonColor = isInvited ? "grey" : "#166939";

        return (
            <View style={ldStyles.itemContainer}>
                <Image style={ldStyles.profileImage} source={{ uri: item?.photoURL || defaultProfilePicture }} />
                <View style={ldStyles.itemContainerText}>
                    <Text style={darkMode ? ldStyles.nameTextD : ldStyles.nameTextL}>{item.fName + ' ' + item.lName}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleInvite(item.id)}
                    disabled={isInvited}
                    style={[styles.inviteButton, { backgroundColor: buttonColor }]}>
                    <Text style={styles.inviteButtonText}>{buttonLabel}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={darkMode ? ldStyles.screenD : ldStyles.screenL}>
            <FlatList
                data={otherUsersList}
                contentContainerStyle={ldStyles.flatListContent}
                keyExtractor={item => item.id.toString()}
                renderItem={renderUserItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inviteButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#166939',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inviteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
