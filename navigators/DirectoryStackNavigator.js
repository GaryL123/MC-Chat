import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DirectoryScreen from '../screens/DirectoryScreen';
import { HeaderScreenOptions } from './navigationConfig';
import translations from '../assets/styles/Translations';
import { useSettings } from '../logic/settingsContext';

const DirectoryStack = createStackNavigator();

const DirectoryStackNavigator = () => {
  const t = (key) => translations[key][language] || translations[key]['English'];
  const { language } = useSettings();

  return (
    <DirectoryStack.Navigator screenOptions={HeaderScreenOptions}>
      <DirectoryStack.Screen name={t("Directory")} component={DirectoryScreen} />
    </DirectoryStack.Navigator>
  );
};

export default DirectoryStackNavigator;
