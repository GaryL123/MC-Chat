import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, } from 'react-native';
import { Image } from 'expo-image';
import { defaultProfilePicture } from '../logic/commonLogic';
import { useRoute } from '@react-navigation/native';
import { useSettings } from '../logic/settingsContext';
import directoryRoomsLogic from '../logic/directoryRoomsLogic';
import ldStyles from '../assets/styles/LightDarkStyles';

export default function RoomsAddUserScreen() {
  const { language, darkMode, textSize } = useSettings();
  const route = useRoute();  // Access route object
  const { roomId } = route.params;  // Destructure roomId from route parameters
  const { fetchMembers, getOrganizedUsers, removeMember } = directoryRoomsLogic();
  const { membersList } = getOrganizedUsers();

  useEffect(() => {
    fetchMembers(roomId);
  }, [roomId]);

  const handleRemove = async (userId) => {
    await removeMember(roomId, userId);
  };

  const renderUserItem = ({ item }) => {
    return (
      <View style={ldStyles.itemContainer}>
        <Image style={ldStyles.profileImage} source={{ uri: item?.photoURL || defaultProfilePicture }} />
        <View style={ldStyles.itemContainerText}>
          <Text style={darkMode ? ldStyles.nameTextD : ldStyles.nameTextL}>{item.fName + ' ' + item.lName}</Text>
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
    <View style={darkMode ? ldStyles.screenD : ldStyles.screenL}>
      <FlatList
        data={membersList}
        contentContainerStyle={ldStyles.flatListContent}
        keyExtractor={item => item.id.toString()}
        renderItem={renderUserItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
