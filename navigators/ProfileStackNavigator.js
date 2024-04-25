import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import { HeaderScreenOptions } from './navigationConfig';
import translations from '../assets/styles/Translations';
import { useSettings } from '../logic/settingsContext';

const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {
  const t = (key) => translations[key][language] || translations[key]['English'];
  const { language } = useSettings();

  return (
    <ProfileStack.Navigator screenOptions={HeaderScreenOptions}>
      <ProfileStack.Screen name={t("Profile")} component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackNavigator;
