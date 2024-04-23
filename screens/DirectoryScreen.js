import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Modal,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import directoryLogic from '../logic/directoryLogic';
import { defaultProfilePicture } from '../logic/commonLogic';

export default function DirectoryScreen() {
  const navigation = useNavigation();
  const {
    getOrganizedUsers,
    sendFriendRequest,
    isFriend,
    sentRequests,
    removeFriend,
  } = directoryLogic();
  const [form, setForm] = useState({
    darkMode: true,
    fontSize: 17,
  });
  const { friendsList, otherUsersList } = getOrganizedUsers();

  const [showRemoveFriendModal, setShowRemoveFriendModal] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState(null);

  const handleFriendButtonPress = (friendId) => {
    setFriendToRemove(friendId);
    setShowRemoveFriendModal(true);
  };

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: form.darkMode ? '#222' : '#166939',
      },
      headerTintColor: '#fff',
    });
  }, [form.darkMode, navigation]);

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
      <View style={styles.userItemContainer}>
        <View style={styles.userInfoContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: item?.photoURL || defaultProfilePicture }}
          />
          <Text style={[styles.emailText, { color: form.darkMode ? 'white' : 'black' }]}>
            {item.email}
          </Text>
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
            styles.friendButton,
            friendshipStatus === 'Friend'
              ? styles.friendButtonFriend
              : friendshipStatus === 'Sent'
              ? styles.friendButtonSent
              : styles.friendButtonAdd,
          ]}
        >
          <Text style={styles.friendButtonText}>{friendshipStatus}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: form.darkMode ? '#222' : '#fff' }]}>
      <View style={styles.screen}>
        <StatusBar style={form.darkMode ? 'light-content' : 'dark-content'} />
        <SectionList
          sections={[
            { title: 'Friends', data: friendsList },
            { title: 'Add Friends', data: otherUsersList },
          ]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          renderSectionHeader={({ section }) => (
            <Text style={[styles.sectionHeader, { color: form.darkMode ? 'white' : 'black' }]}>
              {section.title}
            </Text>
          )}
        />

        <Modal
          visible={showRemoveFriendModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowRemoveFriendModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={{ color: form.darkMode ? 'white' : 'black' }}>
                Are you sure you want to remove this friend?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={confirmRemoveFriend}
                >
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => setShowRemoveFriendModal(false)}
                >
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
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
  container: {
    flex: 1,
  },
});
