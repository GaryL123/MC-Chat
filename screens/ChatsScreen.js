import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { filter, defaultProfilePicture } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import chatsLogic from '../logic/chatsLogic';
import translations from '../assets/styles/Translations';
import { getldStyles } from '../assets/styles/LightDarkStyles';

export default function ChatsScreen() {
  const { language, darkMode, profanityFilter, textSize } = useSettings();
  const navigation = useNavigation();
  const { friends, renderLastMessage, renderTime, openChat } = chatsLogic(navigation);
  const t = (key) => translations[key][language] || translations[key]['English'];
  const ldStyles = getldStyles(textSize);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate(t("New Group Chat"))} style={ldStyles.createRoomButton}>
          <Ionicons name="add-circle-outline" size={30} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const ChatList = ({ friends }) => {
    return (
      <FlatList
        data={friends}
        contentContainerStyle={ldStyles.flatListContent}
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
      <TouchableOpacity onPress={() => openChat(item)} style={[ldStyles.itemContainer]}>
        <Image
          style={ldStyles.profileImage}
          source={{ uri: item?.photoURL || defaultProfilePicture }}
        />
        <View style={ldStyles.itemContainerText}>
          <View style={ldStyles.nameAndTimeRow}>
          <Text style={[darkMode ? ldStyles.nameTextD : ldStyles.nameTextL]}>{item?.fName + ' ' + item?.lName}</Text>
            <Text style={[darkMode ? ldStyles.timeTextD : ldStyles.timeTextL]}>
              {renderTime(item.id)}
            </Text>
          </View>
          <Text style={[darkMode ? ldStyles.lastMessageTextD : ldStyles.lastMessageTextL]}>
            {profanityFilter ? filter.clean(renderLastMessage(item.id)) : renderLastMessage(item.id)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={darkMode ? ldStyles.screenD : ldStyles.screenL}>
      {
        friends.length > 0 ? (
          <ChatList friends={friends} />
        ) : (
          <View style={ldStyles.loserContainer}>
            <Text style={darkMode? ldStyles.nameTextD : ldStyles.nameTextL}>Add some friends!</Text>
          </View>
        )
      }
    </View>
  );
};
