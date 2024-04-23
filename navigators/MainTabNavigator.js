import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatStackNavigator from './ChatStackNavigator';
import RoomStackNavigator from './RoomStackNavigator';
import DirectoryStackNavigator from './DirectoryStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import FriendRequestsStackNavigator from './FriendRequestsStackNavigator';
import RoomInvitesStackNavigator from './RoomInvitesStackNavigator';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
    <Tab.Navigator

      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "lightgray",
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
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="RoomsStack"
        component={RoomStackNavigator}
        options={{
          tabBarLabel: 'Rooms',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DirectoryStack"
        component={DirectoryStackNavigator}
        options={{
          tabBarLabel: 'Directory',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: 'Settings',
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
