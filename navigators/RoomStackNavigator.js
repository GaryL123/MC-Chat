import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RoomsScreen from '../screens/RoomsScreen';
import RoomsAddAdminScreen from '../screens/RoomsAddAdminScreen';
import RoomsAddUserScreen from '../screens/RoomsAddUserScreen';
import RoomsRemUserScreen from '../screens/RoomsRemUserScreen';
import RoomsSettingsScreen from '../screens/RoomsSettingsScreen';
import MessagesRoomScreen from '../screens/MessagesRoomScreen';
import RoomsCreateScreen from '../screens/RoomsCreateScreen';
import { HeaderScreenOptions } from './navigationConfig';

const RoomStack = createStackNavigator();

const RoomStackNavigator = () => (
  <RoomStack.Navigator screenOptions={HeaderScreenOptions}>
    <RoomStack.Screen name="Rooms" component={RoomsScreen} />
    <RoomStack.Screen name="Add Users" component={RoomsAddUserScreen} />
    <RoomStack.Screen name="Remove Users" component={RoomsRemUserScreen} />
    <RoomStack.Screen name="Add Admins" component={RoomsAddAdminScreen} />
    <RoomStack.Screen name="Room Settings" component={RoomsSettingsScreen} />
    <RoomStack.Screen name="MessagesRoom" component={MessagesRoomScreen} />
    <RoomStack.Screen name="Create a Room" component={RoomsCreateScreen} />
  </RoomStack.Navigator>
);

export default RoomStackNavigator;
