import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useUserDirectoryLogic from '../logic/directoryLogic';
import { useAuth } from '../logic/authContext';

export default function DirectoryScreen() {
  const { user } = useAuth();
  const { users } = useUserDirectoryLogic();
  const navigation = useNavigation(); 

  // Check if currentUser and friends are defined before accessing
  const isFriend = (userId) => {
    return user && user.friends && user.friends.includes(userId);
  };

  const handleFriendRequest = async (friendId) => {
    // Logic to send friend request
  };

  const renderUserItem = ({ item }) => {
    const friendId = item.id;
    const friendshipStatus = isFriend(friendId) ? 'Friend' : 'Add';
    const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <Image
          style={styles.profileImage}
          source={{ blurhash }}
          //source={{ uri: item?.profileUrl }}
        />
        <Text style={{ marginLeft: 10 }}>{item.email}</Text> {/* Display email instead of username */}
        <TouchableOpacity
          onPress={() => handleFriendRequest(friendId)}
          disabled={friendshipStatus === 'Friend'}
          style={{ marginLeft: 'auto', paddingVertical: 5, paddingHorizontal: 10, backgroundColor: 'blue', borderRadius: 5 }}
        >
          <Text style={{ color: 'white' }}>
            {friendshipStatus}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => renderUserItem({ item, blurhash })} // Pass blurhash as a prop
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    height: hp(6),
    width: hp(6),
    borderRadius: 100,
  },
});
