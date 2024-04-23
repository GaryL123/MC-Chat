import React, { useLayoutEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, FlatList, StatusBar, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import roomsLogic from '../logic/roomsLogic';
import { Image } from 'expo-image';

export default function RoomsScreen() {
  const navigation = useNavigation();
  const { user, rooms, renderLastMessage, renderTime, openRoom, addUserToRoom, addAdminToRoom, blurhash } = roomsLogic(navigation);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Create a Room')} style={styles.createRoomButton}>
          <Ionicons name="add-circle-outline" size={30} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleJoinRoom = async (roomId) => {
    const result = await addUserToRoom(roomId, user?.uid);
    if (result.success) {
      // Maybe refresh room list or navigate to the room
    } else {
      // Handle errors, possibly with a popup or alert
      console.error("Failed to join room:", result.message);
    }
  }

  const RoomList = ({ rooms }) => {
    return (
      <FlatList
        data={rooms}
        contentContainerStyle={styles.flatListContent}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <RoomItem
          noBorder={index + 1 === rooms.length}
          item={item}
        />}
      />
    );
  };

  const RoomItem = ({ item }) => {
    const isMember = item.members.includes(user.uid);

    return (
      <View>
        <TouchableOpacity onPress={() => isMember && openRoom(item)} disabled={!isMember} style={[styles.roomItem]}>
          <Image
            style={styles.profileImage}
            source={{ blurhash }}
            disabled={!isMember}
          />
          <View style={styles.textContainer}>
            <View style={styles.nameAndTimeRow}>
              <Text style={styles.nameText}>{item?.roomName}</Text>
              {isMember && (
              <Text style={styles.timeText}>
                {renderTime(item.id)}
              </Text>
            )}
            </View>
            {isMember ? (
              <Text style={styles.lastMessageText}>
                {renderLastMessage(item.id)}
              </Text>
            ) : (
              <Text style={styles.lastMessageText}>
                {item.roomDesc}
              </Text>
            )}
          </View>
          {!isMember && (
            <TouchableOpacity onPress={() => handleJoinRoom(item.id)} style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark-content" />
      {
        rooms.length > 0 ? (
          <RoomList rooms={rooms} />
        ) : (
          <View style={styles.noFriendsContainer}>
            <Text>No rooms</Text>
          </View>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  roomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(4),
    marginBottom: hp(1),
    paddingBottom: hp(1),
  },
  profileImage: {
    height: hp(6),
    width: hp(6),
    borderRadius: 100,
  },
  textContainer: {
    flex: 1,
    marginLeft: wp(4),
  },
  nameAndTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: hp(1.8),
    fontWeight: 'bold',
    color: 'black',
  },
  timeText: {
    fontSize: hp(1.6),
    color: 'grey',
  },
  lastMessageText: {
    fontSize: hp(1.6),
    color: 'grey',
  },
  flatListContent: {
    flexGrow: 1,
    paddingVertical: 25,
  },
  noFriendsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(30),
  },
  createRoomButton: {
    height: hp(4.3),
    marginLeft: 15,
    aspectRatio: 1,
    borderRadius: 100,
  },
  joinButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#166939',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
