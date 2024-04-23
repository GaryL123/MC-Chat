import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import directoryRoomsLogic from '../logic/directoryRoomsLogic';
import { Image } from 'expo-image';
import { defaultProfilePicture } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import ldStyles from '../assets/styles/LightDarkStyles';

export default function RoomsInvitesScreen() {
    const { language, darkMode, textSize } = useSettings();
    const { roomInvites, acceptRoomInvite, rejectRoomInvite, fetchRoomInvites } = directoryRoomsLogic();

    useEffect(() => {
        fetchRoomInvites();
    }, []);

    const renderRoomInvitesItem = ({ item }) => {
        return (
            <View style={ldStyles.itemContainer}>
                <Image style={ldStyles.profileImage} source={{ uri: item?.photoURL || defaultProfilePicture }} />
                <View style={ldStyles.itemContainerText}>
                    <Text style={darkMode ? ldStyles.nameTextD : ldStyles.nameTextL}>{item.senderEmail}</Text>
                </View>

                {/* Add space between email and buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => acceptRoomInvite(item.id)}
                        style={[styles.inviteButton, styles.acceptButton]}
                    >
                        <Text style={styles.buttonText}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => rejectRoomInvite(item.id)}
                        style={[styles.inviteButton, styles.rejectButton]}
                    >
                        <Text style={styles.buttonText}>X</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };



    return (
        <View style={darkMode ? ldStyles.screenD : ldStyles.screenL}>
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
    flatListContent: {
        flexGrow: 1,
        paddingTop: 25,
        paddingBottom: 25,
    },
    buttonContainer: {
        flexDirection: 'row', // Stack buttons vertically
        justifyContent: 'center',
        alignItems: 'flex-end', // Align to the right
    },
    inviteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp(1),
        paddingHorizontal: wp(1), // Reduced padding for smaller buttons
        borderRadius: 5,
        width: wp(8), // Reduced width to allow more space for email
        marginLeft: hp(0.5), // Space between buttons
    },
    acceptButton: {
        backgroundColor: '#166939',
    },
    rejectButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
    },
});

