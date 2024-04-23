import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import directoryRoomsLogic from '../logic/directoryRoomsLogic';
import { Image } from 'expo-image';
import { defaultProfilePicture } from '../logic/commonLogic';

export default function RoomsInvitesScreen() {
    const { roomInvites, acceptRoomInvite, rejectRoomInvite, fetchRoomInvites } = directoryRoomsLogic();

    const renderRoomInvitesItem = ({ item }) => {
        console.log(item);
        const { roomId, senderEmail, id } = item;
        return (
            <View style={styles.userItemContainer}>
                {/* Align the user info and email vertically */}
                <View style={styles.userInfoContainer}>
                    <Image style={styles.profileImage} source={{ uri: item?.photoURL || defaultProfilePicture }} />
                    <Text style={styles.emailText}>{senderEmail}</Text>
                </View>
    
                {/* Add space between email and buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => acceptRoomInvite(roomId, item.id)}
                        style={[styles.inviteButton, styles.acceptButton]}
                    >
                        <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => rejectRoomInvite(roomId, item.id)}
                        style={[styles.inviteButton, styles.rejectButton]}
                    >
                        <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    
    

    return (
        <View style={styles.screen}>
            <StatusBar style="dark-content" />
            <FlatList
                data={roomInvites}
                contentContainerStyle={styles.flatListContent}
                keyExtractor={item => item.id.toString()}
                renderItem={renderRoomInvitesItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
    },
    flatListContent: {
        flexGrow: 1,
        paddingBottom: 25,
    },
    userItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Ensures consistent spacing
        paddingHorizontal: wp(2), // Reduced padding for tighter layout
        marginBottom: hp(1),
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: hp(1),
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Makes this container flexible
    },
    profileImage: {
        height: hp(6),
        width: hp(6),
        borderRadius: 100,
    },
    emailText: {
        fontSize: hp(1.8),
        color: 'black',
        marginLeft: wp(2), // Reduced margin between profile pic and email
        flex: 1, // Takes available space
        flexShrink: 1, // Avoids breaking into new lines
        textAlign: 'center', // Centers text
        overflow: 'hidden', // Truncate text if too long
    },
    buttonContainer: {
        flexDirection: 'column', // Stack buttons vertically
        justifyContent: 'center',
        alignItems: 'flex-end', // Align to the right
    },
    inviteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp(1),
        paddingHorizontal: wp(3), // Reduced padding for smaller buttons
        borderRadius: 5,
        width: wp(18), // Reduced width to allow more space for email
        marginBottom: hp(1), // Space between buttons
    },
    acceptButton: {
        backgroundColor: '#166939',
    },
    rejectButton: {
        backgroundColor: 'gray',
    },
    buttonText: {
        color: 'white',
    },
});

