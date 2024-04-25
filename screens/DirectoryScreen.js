import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SectionList, StatusBar, SafeAreaView, StyleSheet, Modal } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../logic/settingsContext';
import { defaultProfilePicture } from '../logic/commonLogic';
import directoryLogic from '../logic/directoryLogic';
import translations from '../assets/styles/Translations';
import { getldStyles } from '../assets/styles/LightDarkStyles';

export default function DirectoryScreen() {
  const { language, darkMode, textSize } = useSettings();
  const navigation = useNavigation();
  const { getOrganizedUsers, sendFriendRequest, isFriend, sentRequests, removeFriend } = directoryLogic();
  const t = (key) => translations[key][language] || translations[key]['English'];
  const ldStyles = getldStyles(textSize);

  const { friendsList, otherUsersList } = getOrganizedUsers();

  const [showRemoveFriendModal, setShowRemoveFriendModal] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState(null);

  const handleFriendButtonPress = (friendId) => {
    setFriendToRemove(friendId);
    setShowRemoveFriendModal(true);
  };

  const confirmRemoveFriend = async () => {
    if (friendToRemove) {
      await removeFriend(friendToRemove);
      setShowRemoveFriendModal(false);
      setFriendToRemove(null);
    }
  };

  const renderUserItem = ({ item }) => {
    const friendId = item.id;
    const friendshipStatus = isFriend(friendId)
      ? 'Friend'
      : sentRequests.includes(friendId)
        ? 'Sent'
        : 'Add';

    return (
      <View style={ldStyles.itemContainer}>
        <Image style={ldStyles.profileImage} source={{ uri: item?.photoURL || defaultProfilePicture }} />
        <View style={ldStyles.itemContainerText}>
          <Text style={[darkMode ? ldStyles.nameTextD : ldStyles.nameTextL]}>{item.fName + ' ' + item.lName}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (friendshipStatus === 'Friend') {
              handleFriendButtonPress(friendId);
            } else {
              sendFriendRequest(friendId);
            }
          }}
          style={[
            styles2.friendButton,
            friendshipStatus === 'Friend'
              ? styles2.friendButtonFriend
              : friendshipStatus === 'Sent'
                ? styles2.friendButtonSent
                : styles2.friendButtonAdd,
          ]}
        >
          <Text style={styles2.friendButtonText}>{friendshipStatus}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={darkMode ? ldStyles.screenD : ldStyles.screenL}>
      <StatusBar style="dark-content" />
      <SectionList
        sections={[
          { title: t("Friends"), data: friendsList },
          { title: t('Users'), data: otherUsersList },
        ]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserItem}
        renderSectionHeader={({ section }) => (
          <Text style={[darkMode ? ldStyles.sectionHeaderD : ldStyles.sectionHeaderL]}>{section.title}</Text>
        )}
      />

      <Modal
        visible={showRemoveFriendModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRemoveFriendModal(false)}
      >
        <View style={styles2.modalContainer}>
          <View style={styles2.modalContent}>
            <Text>Are you sure you want to remove this friend?</Text>
            <View style={styles2.modalButtons}>
              <TouchableOpacity
                style={styles2.modalButton}
                onPress={confirmRemoveFriend}
              >
                <Text style={styles2.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles2.modalButtonCancel}
                onPress={() => setShowRemoveFriendModal(false)}
              >
                <Text style={styles2.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles2 = StyleSheet.create({
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
