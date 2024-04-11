import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { auth } from './firebaseConfig';
import { AuthContextProvider } from './logic/authContext';
import ChatsScreen from './screens/ChatsScreen';
import MessagesScreen from './screens/MessagesScreen';
import RoomsScreen from './screens/RoomsScreen';
import DirectoryScreen from './screens/DirectoryScreen'
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const ChatStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  function AuthStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    );
  }

  function ChatStackNavigator() {
    return (
      <ChatStack.Navigator initialRouteName="Chats">
        <ChatStack.Screen name="ChatsList" component={ChatsScreen} />
        <ChatStack.Screen name="Messages" component={MessagesScreen} />
      </ChatStack.Navigator>
    );
  }

  function MainApp() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "lightgray",
          tabBarStyle: {
            backgroundColor: '#166939',
          },
        }}>
        <Tab.Screen
          name="Chats"
          component={ChatStackNavigator}
          options={{
            tabBarLabel: 'Chats',
            headerStyle: {
              backgroundColor: '#166939',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Rooms"
          component={RoomsScreen}
          options={{
            tabBarLabel: 'Rooms',
            headerStyle: {
              backgroundColor: '#166939',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Directory"
          component={DirectoryScreen}
          options={{
            tabBarLabel: 'Directory',
            headerStyle: {
              backgroundColor: '#166939',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-add-outline" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            headerStyle: {
              backgroundColor: '#166939',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <AuthContextProvider>
        {currentUser ? <MainApp /> : <AuthStack />}
      </AuthContextProvider>
    </NavigationContainer>
  );
}

export default App;
