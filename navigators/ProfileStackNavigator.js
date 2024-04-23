import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import HeaderScreenOptions from './navigationConfig';

const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={HeaderScreenOptions}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

export default ProfileStackNavigator;
