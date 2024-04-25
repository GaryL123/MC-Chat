import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, } from 'react-native';
import { Image } from 'expo-image';
import { defaultProfilePicture } from '../logic/commonLogic';
import { useRoute } from '@react-navigation/native';
import { useSettings } from '../logic/settingsContext';
import directoryRoomsLogic from '../logic/directoryRoomsLogic';
import translations from '../assets/styles/Translations';
import { getldStyles } from '../assets/styles/LightDarkStyles';

export default function RoomsAddAdminScreen() {
  const { language, darkMode, textSize } = useSettings();
  const route = useRoute();
  const { roomId } = route.params;
  const { fetchMembers, getOrganizedUsers, addAdmin } = directoryRoomsLogic();
  const { membersList } = getOrganizedUsers();
  const t = (key) => translations[key][language] || translations[key]['English'];
  const ldStyles = getldStyles(textSize);

  useEffect(() => {
    fetchMembers(roomId);
  }, [roomId]);

  const handleAddAdmin = async (userId) => {
    await addAdmin(roomId, userId);
  };

  const renderUserItem = ({ item }) => {
    return (
      <View style={ldStyles.itemContainer}>
        <Image style={ldStyles.profileImage} source={{ uri: item?.photoURL || defaultProfilePicture }} />
        <View style={ldStyles.itemContainerText}>
          <Text style={darkMode ? ldStyles.nameTextD : ldStyles.nameTextL}>{item.fName + ' ' + item.lName}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleAddAdmin(item.id)}
          style={styles.removeButton}
        >
          <Text style={styles.removeButtonText}>{t("Add")}</Text>
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
    backgroundColor: '#166939',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
