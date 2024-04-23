import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FriendRequestsScreen from '../screens/FriendRequestsScreen';
import HeaderScreenOptions from './navigationConfig';

const FriendRequestsStack = createStackNavigator();

const FriendRequestsStackNavigator = () => (
  <FriendRequestsStack.Navigator screenOptions={HeaderScreenOptions}>
    <FriendRequestsStack.Screen name="Friend Requests" component={FriendRequestsScreen} />
  </FriendRequestsStack.Navigator>
);

export default FriendRequestsStackNavigator;
