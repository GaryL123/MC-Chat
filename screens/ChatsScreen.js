import React, { useLayoutEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, FlatList, StatusBar, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { filter, defaultProfilePicture } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import chatsLogic from '../logic/chatsLogic';
import styles from '../assets/styles/AppStyles';
import ldStyles from '../assets/styles/LightDarkStyles';

export default function ChatsScreen() {
  const { language, darkMode, profanityFilter, textSize } = useSettings();
  const navigation = useNavigation();
  const { friends, renderLastMessage, renderTime, openChat } = chatsLogic(navigation);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Create a Group Chat')} style={styles2.createRoomButton}>
          <Ionicons name="add-circle-outline" size={30} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const ChatList = ({ friends }) => {
    return (
      <FlatList
        data={friends}
        contentContainerStyle={styles2.flatListContent}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <ChatItem
          noBorder={index + 1 === friends.length}
          item={item}
        />}
      />
    );
  };

  const ChatItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => openChat(item)} style={[styles2.chatItem]}>
        <Image
          style={styles2.profileImage}
          source={{ uri: item?.photoURL || defaultProfilePicture }}
        />
        <View style={styles2.textContainer}>
          <View style={styles2.nameAndTimeRow}>
            <Text style={darkMode ? ldStyles.nameTextD : ldStyles.nameTextL}>{item?.fName + ' ' + item?.lName}</Text>
            <Text style={darkMode ? ldStyles.timeTextD : ldStyles.timeTextL}>
              {renderTime(item.id)}
            </Text>
          </View>
          <Text style={darkMode ? ldStyles.lastMessageTextD : ldStyles.lastMessageTextL}>
            {profanityFilter ? filter.clean(renderLastMessage(item.id)) : renderLastMessage(item.id)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={darkMode ? ldStyles.screenD : ldStyles.screenL}>
      <StatusBar style="dark-content" />
      {
        friends.length > 0 ? (
          <ChatList friends={friends} />
        ) : (
          <View style={styles2.noFriendsContainer}>
            <Text>Add some friends!</Text>
          </View>
        )
      }
    </View>
  );
}

const styles2 = StyleSheet.create({
  chatItem: {
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
});
