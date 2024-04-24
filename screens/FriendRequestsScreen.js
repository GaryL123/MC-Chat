// FriendRequestsScreen.js
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import directoryLogic from '../logic/directoryLogic';
import { Image } from 'expo-image';
import { defaultProfilePicture } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import ldStyles from '../assets/styles/LightDarkStyles';

export default function FriendRequestsScreen() {
    const { language, darkMode, textSize } = useSettings();
    const { friendRequests, acceptFriendRequest, rejectFriendRequest, fetchFriendRequests } = directoryLogic();

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    const renderFriendRequestItem = ({ item }) => {
        return (
            <View style={ldStyles.itemContainer}>
                <Image style={ldStyles.profileImage} source={{ uri: item?.photoURL || defaultProfilePicture }} />
                <View style={ldStyles.itemContainerText}>
                    <Text style={darkMode ? ldStyles.nameTextD : ldStyles.nameTextL}>{item.senderEmail}</Text>
                </View>

                {/* Add space between email and buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => acceptFriendRequest(item.id)}
                        style={[styles.friendButton, styles.acceptButton]}
                    >
                        <Text style={styles.buttonText}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => rejectFriendRequest(item.id)}
                        style={[styles.friendButton, styles.rejectButton]}
                    >
                        <Text style={styles.buttonText}>X</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={darkMode ? ldStyles.screenD : ldStyles.screenL}>
            <FlatList
                data={friendRequests}
                contentContainerStyle={ldStyles.flatListContent}
                keyExtractor={item => item.id.toString()}
                renderItem={renderFriendRequestItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    friendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp(1),
        paddingHorizontal: wp(1),
        borderRadius: 5,
        width: wp(8),
        marginLeft: hp(0.5),
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

