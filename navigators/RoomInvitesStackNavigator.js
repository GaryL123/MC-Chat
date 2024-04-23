import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RoomsInvitesScreen from '../screens/RoomInvitesScreen';
import { HeaderScreenOptions } from './navigationConfig';

const RoomInvitesStack = createStackNavigator();

const RoomInvitesStackNavigator = () => (
  <RoomInvitesStack.Navigator screenOptions={HeaderScreenOptions}>
    <RoomInvitesStack.Screen name="Room Invites" component={RoomsInvitesScreen} />
  </RoomInvitesStack.Navigator>
);

export default RoomInvitesStackNavigator;
