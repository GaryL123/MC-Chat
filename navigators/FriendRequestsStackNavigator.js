import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FriendRequestsScreen from '../screens/FriendRequestsScreen';
import { HeaderScreenOptions } from './navigationConfig';
import translations from '../assets/styles/Translations';
import { useSettings } from '../logic/settingsContext';

const FriendRequestsStack = createStackNavigator();

const FriendRequestsStackNavigator = () => {
  const t = (key) => translations[key][language] || translations[key]['English'];
  const { language } = useSettings();

  return (
    <FriendRequestsStack.Navigator screenOptions={HeaderScreenOptions}>
      <FriendRequestsStack.Screen name={t("Friend Requests")} component={FriendRequestsScreen} />
    </FriendRequestsStack.Navigator>
  );
};

export default FriendRequestsStackNavigator;
