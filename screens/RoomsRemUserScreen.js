import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, StyleSheet, Modal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { defaultProfilePicture } from '../logic/commonLogic';
import { useRoute } from '@react-navigation/native';
import { useSettings } from '../logic/settingsContext';
import directoryRoomsLogic from '../logic/directoryRoomsLogic';
import ldStyles from '../assets/styles/LightDarkStyles';

export default function RoomsAddUserScreen() {
  const { language, darkMode, textSize } = useSettings();
  const navigation = useNavigation();
  const route = useRoute();  // Access route object
  const { roomId } = route.params;  // Destructure roomId from route parameters
  const { fetchMembers, getOrganizedUsers, removeMember } = directoryRoomsLogic();
  const { membersList } = getOrganizedUsers();

  useEffect(() => {
    fetchMembers(roomId);
  }, [roomId]);

  const handleRemove = async (userId) => {
    await removeMember(userId);
  };

  const renderUserItem = ({ item }) => {
    return (
      <View style={styles.userItemContainer}>
        <View style={styles.userInfoContainer}>
          <Image style={styles.profileImage} source={{ uri: item?.photoURL || defaultProfilePicture }} />
          <Text style={styles.emailText}>{item.fName + ' ' + item.lName}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleRemove(item.id)}
          style={styles.removeButton}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark-content" />
      <FlatList
        data={membersList}
        keyExtractor={item => item.id.toString()}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContainer}
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
  removeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'red',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
