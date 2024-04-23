import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SectionList, StatusBar, StyleSheet, Modal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import directoryRoomsLogic from '../logic/directoryRoomsLogic';
import { defaultProfilePicture } from '../logic/commonLogic';

export default function RoomsAddUserScreen() {
    const navigation = useNavigation();
    const { getOrganizedUsers, sendRoomInvite, isMember, sentRoomInvites, removeMember } = directoryRoomsLogic();

    const { membersList, otherUsersList } = getOrganizedUsers();

    // State for managing the "Remove Friend" modal
    const [showRemoveFriendModal, setShowRemoveFriendModal] = useState(false);
    const [friendToRemove, setFriendToRemove] = useState(null);

    const handleFriendButtonPress = (friendId) => {
        setFriendToRemove(friendId);
        setShowRemoveFriendModal(true);
    };

    const confirmRemoveFriend = async () => {
        if (friendToRemove) {
            await removeFriend(friendToRemove); // Call the logic function to remove the friend
            setShowRemoveFriendModal(false);
            setFriendToRemove(null);
        }
    };

    const renderUserItem = ({ item }) => {
        const friendId = item.id;
        const membershipStatus = isMember(friendId)
            ? 'Friend'
            : sentRoomInvites.includes(friendId)
                ? 'Sent'
                : 'Add';

        return (
            <View style={styles.userItemContainer}>
                <View style={styles.userInfoContainer}>
                    <Image style={styles.profileImage} source={{ uri: item?.photoURL || defaultProfilePicture }} />
                    <Text style={styles.emailText}>{item.email}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        if (membershipStatus === 'Friend') {
                            handleFriendButtonPress(friendId); // Open the modal to confirm removal
                        } else {
                            sendFriendRequest(friendId); // Send a friend request if not already a friend
                        }
                    }}
                    style={[
                        styles.friendButton,
                        membershipStatus === 'Friend'
                            ? styles.friendButtonFriend
                            : membershipStatus === 'Sent'
                                ? styles.friendButtonSent
                                : styles.friendButtonAdd,
                    ]}
                >
                    <Text style={styles.friendButtonText}>{membershipStatus}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.screen}>
            <StatusBar style="dark-content" />
            <SectionList
                sections={[
                    { title: 'Friends', data: membersList },
                    { title: 'Add Friends', data: otherUsersList },
                ]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderUserItem}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                )}
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
    friendButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#166939',
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
    friendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
