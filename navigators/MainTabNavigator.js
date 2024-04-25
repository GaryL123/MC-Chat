import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatStackNavigator from './ChatStackNavigator';
import RoomStackNavigator from './RoomStackNavigator';
import DirectoryStackNavigator from './DirectoryStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import FriendRequestsStackNavigator from './FriendRequestsStackNavigator';
import RoomInvitesStackNavigator from './RoomInvitesStackNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../logic/settingsContext';

const Tab = createBottomTabNavigator();

const TranslatedTabBarLabel = ({ labelKey }) => {
  const { language } = useSettings();
  const translations = {
    Chats: { English: "Chats", Spanish: "Charlas" },
    Rooms: { English: "Rooms", Spanish: "Habitaciones" },
    Directory: { English: "Directory", Spanish: "Directorio" },
    Settings: { English: "Settings", Spanish: "Configuraciones" }
  };

  return () => <Text style={{fontSize: 10, color: 'white'}}>{translations[labelKey][language] || translations[labelKey]['English']}</Text>;
};

const MainTabNavigator = () => (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "darkgray",
        tabBarStyle: {
          backgroundColor: '#166939',
          height: 100,
          borderTopWidth: 0,
        },
      }}>

      <Tab.Screen
        name="ChatsStack"
        component={ChatStackNavigator}
        options={{
          tabBarLabel: TranslatedTabBarLabel({ labelKey: "Chats" }),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="RoomsStack"
        component={RoomStackNavigator}
        options={{
          tabBarLabel: TranslatedTabBarLabel({ labelKey: "Rooms" }),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DirectoryStack"
        component={DirectoryStackNavigator}
        options={{
          tabBarLabel: TranslatedTabBarLabel({ labelKey: "Directory" }),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: TranslatedTabBarLabel({ labelKey: "Settings" }),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="FriendRequestsStack"
        component={FriendRequestsStackNavigator}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="RoomInvitesStack"
        component={RoomInvitesStackNavigator}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
);

export default MainTabNavigator;

const styles = StyleSheet.create({
  friendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#166939',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
