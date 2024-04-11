import React, { useState, useEffect } from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { auth } from './firebaseConfig';
import { AuthContextProvider, useAuth } from './logic/authContext';
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
const RoomStack = createStackNavigator();
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
    const { logout } = useAuth();

    const handleLogout = async () => {
      await logout();
    }

    return (
      <ChatStack.Navigator initialRouteName="ChatsList"
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "lightgray",
          tabBarStyle: {
            backgroundColor: '#166939',
            height: 100,
          },
          headerStyle: {
            backgroundColor: '#166939',
            height: 115,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <Button
              onPress={handleLogout}
              title="Logout"
              color="#fff"
            />
          ),
        }}>
        <ChatStack.Screen name="Chats" component={ChatsScreen} />
        <ChatStack.Screen name="Messages" component={MessagesScreen} />
      </ChatStack.Navigator>
    );
  }

  function RoomStackNavigator() {
    const { logout } = useAuth();

    const handleLogout = async () => {
      await logout();
    }

    return (
      <RoomStack.Navigator initialRouteName="RoomsList"
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "lightgray",
          tabBarStyle: {
            backgroundColor: '#166939',
            height: 100,
          },
          headerStyle: {
            backgroundColor: '#166939',
            height: 115,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <Button
              onPress={handleLogout}
              title="Logout"
              color="#fff"
            />
          ),
        }}>
        <RoomStack.Screen name="Rooms" component={RoomsScreen} />
        <RoomStack.Screen name="Messages" component={MessagesScreen} />
      </RoomStack.Navigator>
    );
  }

  function MainApp() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "lightgray",
          tabBarStyle: {
            backgroundColor: '#166939',
            height: 100,
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
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Directory"
          component={DirectoryScreen}
          options={{
            tabBarLabel: 'Directory',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-add-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
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
