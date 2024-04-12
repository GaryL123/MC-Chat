import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { auth } from './firebaseConfig';
import { AuthContextProvider, useAuth } from './logic/authContext';
import ChatsScreen from './screens/ChatsScreen';
import DirectoryScreen from './screens/DirectoryScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import LoginScreen from './screens/LoginScreen';
import MessagesScreen from './screens/MessagesScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import RoomsScreen from './screens/RoomsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { blurhash } from './logic/commonLogic';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createStackNavigator();
const ChatStack = createStackNavigator();
const RoomStack = createStackNavigator();
const DirectoryStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const HeaderScreenOptions = {
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
      <ProfileButton/>
    ),
  }

  const NotificationBubble = ({ count }) => {
    return (
      <View style={{
        minWidth: 20,
        padding: 2,
        backgroundColor: 'red',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{ color: 'white', fontSize: 10, padding: 1 }}>{count}</Text>
      </View>
    );
  };

  const MenuItem = ({ text, action, value, icon, customContent }) => {
    return (
      <MenuOption onSelect={() => action(value)}>
        <View style={styles.menuItem}>
          <Text style={styles.menuItemText}>
            {text}
          </Text>
          {customContent ? customContent : icon}
        </View>
      </MenuOption>
    );
  };

  const Divider = () => {
    return (
      <View style={styles.divider} />
    );
  };

  const ProfileButton = () => {
    const { logout, pendingFriendRequests } = useAuth();
    const hasPendingRequests = pendingFriendRequests && pendingFriendRequests.length > 0;
    const { top } = useSafeAreaInsets();
    const navigation = useNavigation();

    const handleLogout = async () => {
      await logout();
    }

    return (
      <View style={styles.container}>
        <View>
          <Menu>
            <MenuTrigger>
              <Image
                style={styles.profileImage}
                source={{ blurhash }}
              />
              {hasPendingRequests && (
                <View style={styles.notificationBubble}>
                  <Text style={styles.notificationText}>{pendingFriendRequests.length}</Text>
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
                  action={() => navigation.navigate('FriendRequestsScreen')}
                  value={null}
                  customContent={
                    <NotificationBubble count={pendingFriendRequests.length} />
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
    );
  };

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
      <ChatStack.Navigator initialRouteName="ChatsStack" screenOptions={HeaderScreenOptions}>
        <ChatStack.Screen name="Chats" component={ChatsScreen} />
        <ChatStack.Screen name="Messages" component={MessagesScreen} />
      </ChatStack.Navigator>
    );
  }

  function RoomStackNavigator() {
    return (
      <RoomStack.Navigator initialRouteName="RoomsStack" screenOptions={HeaderScreenOptions}>
        <RoomStack.Screen name="Rooms" component={RoomsScreen} />
        <RoomStack.Screen name="Messages" component={MessagesScreen} />
      </RoomStack.Navigator>
    );
  }

  function DirectoryStackNavigator() {
    return (
      <DirectoryStack.Navigator initialRouteName="DirectoryStack" screenOptions={HeaderScreenOptions}>
        <DirectoryStack.Screen name="Directory" component={DirectoryScreen} />
      </DirectoryStack.Navigator>
    );
  }

  function SettingsStackNavigator() {
    return (
      <SettingsStack.Navigator initialRouteName="SettingsStack" screenOptions={HeaderScreenOptions}>
        <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      </SettingsStack.Navigator>
    );
  }

  function ProfileStackNavigator() {
    return (
      <ProfileStack.Navigator initialRouteName="ProfileStack" screenOptions={HeaderScreenOptions}>
        <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      </ProfileStack.Navigator>
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
          name="DirectoryStack"
          component={DirectoryStackNavigator}
          options={{
            tabBarLabel: 'Directory',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-add-outline" size={size} color={color} />
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
      </Tab.Navigator>
    );
  }

  return (
    <MenuProvider>
      <NavigationContainer>
        <AuthContextProvider>
          {currentUser ? <MainApp /> : <AuthStack />}
        </AuthContextProvider>
      </NavigationContainer>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#00a400', // Equivalent to Tailwind bg-green-700
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    elevation: 10,
  },
  menuItemIcon: {
    fontSize: 20,
    color: 'gray',
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: hp(1.7),
    fontWeight: '600',
    color: '#4a5568',  // This color corresponds to Tailwind's text-neutral-600
  },
  divider: {
    height: 1, // equivalent to p-[1px] in Tailwind for height
    width: '100%', // w-full in Tailwind
    backgroundColor: '#e2e8f0',  // This color corresponds to Tailwind's bg-neutral-200
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 30,  // Approximation of rounded-b-3xl in Tailwind
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: hp(3),
    fontWeight: '500',
    color: 'white',  // Font color similar to text-white in Tailwind
  },
  profileImage: {
    height: hp(4.3),
    aspectRatio: 1,
    borderRadius: 100,
  },
  notificationBubble: {
    position: 'absolute',
    right: -6,
    bottom: -3,
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
  menuOptionsStyle: {
    borderRadius: 10,
    marginTop: 40,
    marginLeft: -30,
    backgroundColor: 'white',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    width: 160
  },
});

export default App;
