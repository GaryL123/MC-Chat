import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import directoryLogic from '../logic/directoryLogic';
import { Feather } from '@expo/vector-icons';

export default function DirectoryScreen() {
    const navigation = useNavigation();
    const { users } = directoryLogic();

    const renderUserItem = ({ item }) => {
        const isFriend = false; // You can implement your logic to check if the user is a friend
        const friendshipStatus = isFriend ? 'Friend' : 'Add';
        const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

        return (
            <TouchableOpacity style={styles.userItemContainer} onPress={() => {/* Handle navigation to user profile */}}>
                <Image
                    style={styles.profileImage}
                    source={{ blurhash }}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.emailText}>{item.email}</Text>
                    {/* Add more user information as needed */}
                </View>
                <TouchableOpacity
                    onPress={() => handleFriendRequest(item.id)}
                    disabled={isFriend}
                    style={[styles.friendButton, { backgroundColor: isFriend ? '#ccc' : 'blue' }]}>
                    <Text style={styles.friendButtonText}>
                        {friendshipStatus}
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                renderItem={renderUserItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    userItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    profileImage: {
        height: hp(6),
        width: hp(6),
        borderRadius: 100,
    },
    userInfo: {
        flex: 1,
        marginLeft: 10,
    },
    emailText: {
        fontSize: hp(1.8),
        fontWeight: 'bold',
        color: 'black',
    },
    friendButton: {
        marginLeft: 'auto',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    friendButtonText: {
        color: 'white',
    },
});
