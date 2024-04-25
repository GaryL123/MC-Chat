import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, StyleSheet } from 'react-native';
import { useSettings } from '../logic/settingsContext';
import roomsLogic from '../logic/roomsLogic';
import { Image } from 'expo-image';
import { filter, defaultProfilePicture } from '../logic/commonLogic';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../assets/styles/AppStyles';
import { getldStyles } from '../assets/styles/LightDarkStyles';

export default function RoomsScreen() {
  const { darkMode, profanityFilter, textSize } = useSettings();
  const navigation = useNavigation();
  const { user, rooms, renderLastMessage, renderTime, openRoom, addUserToRoom } = roomsLogic(navigation);
  const ldStyles = getldStyles(textSize);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Create a Room')} style={styles2.createRoomButton}>
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
        contentContainerStyle={ldStyles.flatListContent}
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
        <TouchableOpacity onPress={() => isMember && openRoom(item)} disabled={!isMember} style={[ldStyles.itemContainer]}>
          <Image
            style={ldStyles.profileImage}
            source={{ uri: item?.roomPhoto || defaultProfilePicture }}
            disabled={!isMember}
          />
          <View style={styles2.textContainer}>
            <View style={styles2.nameAndTimeRow}>
            <Text style={[darkMode ? ldStyles.nameTextD : ldStyles.nameTextL]}>{item?.roomName}</Text>
              {isMember && (
                <Text style={[darkMode ? ldStyles.timeTextD : ldStyles.timeTextL]}>
                {renderTime(item.id)}
              </Text>
              )}
            </View>
            {isMember ? (
              <Text style={[darkMode ? ldStyles.lastMessageTextD : ldStyles.lastMessageTextL]}>
              {(profanityFilter || item.roomFilter ) ? filter.clean(renderLastMessage(item.id)) : renderLastMessage(item.id)}
            </Text>
            ) : (
              <Text style={[darkMode ? ldStyles.lastMessageTextD : ldStyles.lastMessageTextL]}>{item.roomDesc}</Text>
            )}
          </View>
          {!isMember && (
            <TouchableOpacity onPress={() => handleJoinRoom(item.id)} style={styles2.joinButton}>
              <Text style={styles2.joinButtonText}>Join</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={darkMode ? styles.screenD : styles.screenL}>
      <StatusBar style="dark-content" />
      {
        rooms.length > 0 ? (
          <RoomList rooms={rooms} />
        ) : (
          <View style={ldStyles.loserContainer}>
            <Text style={darkMode? ldStyles.nameTextD : ldStyles.nameTextL}>No rooms</Text>
          </View>
        )
      }
    </View>
  );
}

const styles2 = StyleSheet.create({
  textContainer: {
    flex: 1,
    marginLeft: wp(4),
  },
  nameAndTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
