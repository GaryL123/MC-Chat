import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, SectionList, StatusBar, StyleSheet, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../logic/settingsContext';
import { defaultProfilePicture } from '../logic/commonLogic';
import directoryLogic from '../logic/directoryLogic';
import chatsLogic from '../logic/chatsLogic';
import translations from '../assets/styles/Translations';
import { getldStyles } from '../assets/styles/LightDarkStyles';
import { Feather } from '@expo/vector-icons';
import ActionSheet from 'react-native-actionsheet';
import { db } from '../firebaseConfig';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../logic/authContext';
import { collection, getDocs } from 'firebase/firestore';

export default function DirectoryScreen() {
  const { language, darkMode, textSize } = useSettings();
  const navigation = useNavigation();
  const { getOrganizedUsers, sendFriendRequest, isFriend, sentRequests, removeFriend } = directoryLogic();
  const t = (key) => translations[key][language] || translations[key]['English'];
  const ldStyles = getldStyles(textSize);
  const [selectedUser, setSelectedUser] = useState(null); 
  const { friendsList, otherUsersList } = getOrganizedUsers();
  const { openChat } = chatsLogic(useNavigation());
  const { user } = useAuth();  // Make sure you have access to the current user
  const [blockedUserIds, setBlockedUserIds] = useState([]);
  
  useEffect(() => {
    if (user && user.uid) {
        const blockedUsersRef = collection(db, 'users', user.uid, 'blockedUsers');

        getDocs(blockedUsersRef).then(snapshot => {
            const ids = snapshot.docs.map(doc => doc.id);
            setBlockedUserIds(ids);
        }).catch(error => console.error("Failed to fetch blocked users:", error));
    }
  }, [user]);

  const actionSheetRef = useRef(null);
  
  const blockUser = async (currentUserId, blockedUserId) => {
    // Path to the current user's blocked users collection
    const blockedUserRef = doc(db, 'users', currentUserId, 'blockedUsers', blockedUserId);

    // Add to blocked users with current timestamp
    await setDoc(blockedUserRef, { blockedOn: new Date() });

    // Optionally remove from friends (assuming friends are managed similarly)
    const friendRef = doc(db, 'users', currentUserId, 'friends', blockedUserId);
    await deleteDoc(friendRef);
  };

  const showActionSheet = (item) => {
    setSelectedUser(item); // Update state
    setTimeout(() => actionSheetRef.current.show(), 0); // Add a slight delay to ensure the state is updated
  };

  const handleAction = (index) => {
    if (index === 0) { // Direct Message
      openChat(selectedUser);
    } else if (index === 1) { // Remove Friend
      Alert.alert('Confirm Removal', `Are you sure you want to remove ${selectedUser.fName + ' ' + selectedUser.lName} from your friend list?`,
        [{ text: 'Yes', onPress: () => removeFriend(selectedUser.id) }, { text: 'No', style: 'cancel' }],
        { cancelable: false }
      );
    } else if (index === 2) { // Block Friend
      Alert.alert('Confirm Blocking', `Are you sure you want to block ${selectedUser.fName + ' ' + selectedUser.lName}? This will prevent them from contacting you and remove them from your friends list.`,
        [{ text: 'Yes', onPress: () => {
          if (user && user.uid) {
            blockUser(user.uid, selectedUser.id);
          } else {
            console.error("User is not logged in.");
          }
        } }, { text: 'No', style: 'cancel' }],
        { cancelable: false }
      );
    }
  };

  const renderUserItem = ({ item }) => {
    const friendId = item.id;
    const isBlocked = blockedUserIds.includes(friendId);

    if (isBlocked) {
        return null;  // Do not render this user item if they are blocked
    }

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
              showActionSheet(item);
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
          {friendshipStatus === 'Friend' ? (
            <Feather name="more-vertical" size={24} color="white" />
          ) : (
            <Text style={styles2.friendButtonText}>{friendshipStatus}</Text>
          )}
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
      <ActionSheet
        ref={actionSheetRef}
        title={'What would you like to do?'}
        options={['Direct Message', 'Remove Friend', 'Block Friend', 'Cancel']}
        cancelButtonIndex={3}
        destructiveButtonIndex={[1, 2]} // This makes both Remove and Block appear in red
        onPress={(index) => handleAction(index)}
      />
    </View>
  );
}

const styles2 = StyleSheet.create({
  friendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendButtonAdd: {
    backgroundColor: 'green',
  },
  friendButtonSent: {
    backgroundColor: 'gray',
  },
  friendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
