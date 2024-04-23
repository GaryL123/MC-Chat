import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../logic/authContext';
import { defaultProfilePicture } from '../logic/commonLogic';
import MenuItem from './MenuItem';
import Divider from './Divider';
import NotificationBubble from './NotificationBubble';


const ProfileButton = () => {
  const { user, logout, pendingFriendRequests, pendingRoomInvites } = useAuth();
  const navigation = useNavigation();
  const hasPendingRequests = pendingFriendRequests && pendingFriendRequests.length > 0;
  const hasPendingInvites = pendingRoomInvites && pendingRoomInvites.length > 0;
  const totalNotifications = (hasPendingRequests ? pendingFriendRequests.length : 0) + (hasPendingInvites ? pendingRoomInvites.length : 0);
  const hasNotifications = hasPendingRequests || hasPendingInvites;
  const handleLogout = async () => {
    await logout();
  };

  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <View>
          <Menu>
            <MenuTrigger>
              <Image
                style={styles.profileImage}
                source={{ uri: user?.photoURL || defaultProfilePicture }}
              />
              {hasNotifications  && (
                <View style={styles.notificationBubble}>
                  <Text style={styles.notificationText}>{totalNotifications}</Text>
                </View>
              )}
            </MenuTrigger>
            <MenuOptions
              customStyles={{ optionsContainer: styles.menuOptionsStyle }}>
              <MenuItem
                text="Profile"
                action={() => navigation.navigate('ProfileStack')}
                value={null}
                icon={<Ionicons name="person-outline" size={hp(2.5)} color="gray" />}
              />
              <Divider />
              {hasPendingRequests && (
                <MenuItem
                  text="Friend Requests"
                  action={() => navigation.navigate('FriendRequestsStack')}
                  value={null}
                  customContent={
                    <NotificationBubble count={pendingFriendRequests.length} />
                  }
                />
              )}
              {hasPendingInvites && (
                <MenuItem
                  text="Room Invites"
                  action={() => navigation.navigate('RoomInvitesStack')}
                  value={null}
                  customContent={
                    <NotificationBubble count={pendingRoomInvites.length} />
                  }
                />
              )}
              <MenuItem
                text="Log Out"
                action={handleLogout}
                value={null}
                icon={<Ionicons name="log-out-outline" size={hp(2.5)} color="gray" />}
              />
            </MenuOptions>
          </Menu>
        </View>
      </View>
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    height: hp(4.3),
    aspectRatio: 1,
    borderRadius: 100,
    marginBottom: 10,
  },
  notificationBubble: {
    position: 'absolute',
    right: -3,
    bottom: 3,
    backgroundColor: 'red',
    borderRadius: 50,
    width: hp(2),
    height: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },  
    menuOptionsStyle: {
    borderRadius: 10,
    marginTop: 30,
    marginLeft: -30,
    backgroundColor: 'white',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    width: 190
  }
});

export default ProfileButton;