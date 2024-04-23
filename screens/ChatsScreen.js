import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, FlatList, StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import chatsLogic from '../logic/chatsLogic';
import { Image } from 'expo-image';
import { defaultProfilePicture } from '../logic/commonLogic';

export default function ChatsScreen() {
  const navigation = useNavigation();
  const { friends, renderLastMessage, renderTime, openChat } = chatsLogic(navigation);
  const [form, setForm] = useState({
    darkMode: false,
    fontSize: 17,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Create a Group Chat')} style={styles.createRoomButton}>
          <Ionicons name="add-circle-outline" size={30} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: form.darkMode ? '#222' : '#166939',
      },
      headerTintColor: '#fff',
    });
  }, [form.darkMode, navigation]);

  const calculateFontSize = (baseFontSize) => {
    return baseFontSize * (form.fontSize / 17);
  };

  const ChatList = ({ friends }) => {
    return (
      <FlatList
        data={friends}
        contentContainerStyle={styles.flatListContent}
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
      <TouchableOpacity onPress={() => openChat(item)} style={[styles.chatItem ]}>
        <Image
          style={styles.profileImage}
          source={{ uri: item?.photoURL || defaultProfilePicture }}
        />
        <View style={styles.textContainer}>
          <View style={styles.nameAndTimeRow}>
            <Text style={[styles.nameText, { color: form.darkMode ? 'white' : 'black' }]}>
              {item?.fName + ' ' + item?.lName}
            </Text>
            <Text style={[styles.timeText, { color: form.darkMode ? 'white' : 'grey' }]}>
              {renderTime(item.id)}
            </Text>
          </View>
          <Text style={[styles.lastMessageText, { color: form.darkMode ? 'white' : 'grey' }]}>
            {renderLastMessage(item.id)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: form.darkMode ? '#222' : '#fff' }]}>
      <View style={styles.screen}>
        <StatusBar style={form.darkMode ? 'light-content' : 'dark-content'} />
        {
          friends.length > 0 ? (
            <ChatList friends={friends} />
          ) : (
            <View style={styles.noFriendsContainer}>
              <Text style={{ color: form.darkMode ? 'white' : 'black' }}>Add some friends!</Text>
            </View>
          )
        }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
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
  },
  timeText: {
    fontSize: hp(1.6),
  },
  lastMessageText: {
    fontSize: hp(1.6),
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
  container: {
    flex: 1,
  },
});
