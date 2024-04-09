import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { auth } from './firebaseConfig'; // Ensure this is correctly pointing to your Firebase config
import HomeScreen from './screens/HomeScreen';
import ChatsScreen from './screens/ChatsScreen';
import RoomsScreen from './screens/RoomsScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import ForgotPassword from './screens/ForgotPassword';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return unsubscribe; // Unsubscribe on unmount
  }, []);

  function AuthStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
    );
  }

  function MainApp() {
    return (
      <Tab.Navigator>
    <Tab.Screen
    name="Home"
    component={HomeScreen}
    options={{
      tabBarLabel: 'Home',
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="home" color={color} size={size} />
      ),
    }}
  />
        <Tab.Screen
    name="Chats"
    component={ChatsScreen}
    options={{
      tabBarLabel: 'Chats',
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="chatbubble-outline" size={24} color="black" />
      ),
    }}
  />
        <Tab.Screen
    name="Rooms"
    component={RoomsScreen}
    options={{
      tabBarLabel: 'Rooms',
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="people-outline" size={24} color="black" />
      ),
    }}
  />
        <Tab.Screen
    name="Settings"
    component={SettingsScreen}
    options={{
      tabBarLabel: 'Settings',
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="settings-outline" size={24} color="black" />
      ),
    }}
  />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {currentUser ? <MainApp /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default App;
