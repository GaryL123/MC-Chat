// DirectoryScreen.js
import { React } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, FlatList, StatusBar, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import directoryLogic from '../logic/directoryLogic';
import { Image } from 'expo-image';

export default function DirectoryScreen() {
    const navigation = useNavigation();
    const { users, sendFriendRequest, isFriend, sentRequests } = directoryLogic();

    const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

    const renderUserItem = ({ item }) => {
        const friendId = item.id;
        const friendshipStatus = isFriend(friendId) ? 'Friend' : (sentRequests.includes(friendId) ? 'Sent' : 'Add');

        return (
            <View style={styles.userItemContainer}>
                <View style={styles.userInfoContainer}>
                    <Image style={styles.profileImage} source={{ blurhash }} />
                    <Text style={styles.emailText}>{item.email}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => sendFriendRequest(friendId)}
                    disabled={friendshipStatus === 'Friend' || friendshipStatus === 'Sent'}
                    style={[
                        styles.friendButton,
                        friendshipStatus === 'Friend' ? styles.friendButtonFriend :
                            (friendshipStatus === 'Sent' ? styles.friendButtonSent : styles.friendButtonAdd)
                    ]}
                >
                    <Text style={styles.friendButtonText}>
                        {friendshipStatus}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.screen}>
            <StatusBar style="dark-content" />
            <FlatList
                data={users}
                contentContainerStyle={styles.flatListContent}
                keyExtractor={item => item.id.toString()}
                renderItem={renderUserItem}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        marginBottom: hp(1),
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
        fontSize: hp(1.8),
        color: 'black',
    },
    friendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp(1),
        paddingHorizontal: wp(4),
        borderRadius: 5,
        width: wp(20),
    },
    friendButtonAdd: {
        backgroundColor: '#166939',
    },
    friendButtonFriend: {
        backgroundColor: '#166939',
    },
    friendButtonSent: {
        backgroundColor: 'gray', // Change color for Sent button
    },
    friendButtonText: {
        color: 'white',
    },
});
