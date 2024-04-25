import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/SettingsScreen';
import { HeaderScreenOptions } from './navigationConfig';
import translations from '../assets/styles/Translations';
import { useSettings } from '../logic/settingsContext';

const SettingsStack = createStackNavigator();

const SettingsStackNavigator = () => {
  const t = (key) => translations[key][language] || translations[key]['English'];
  const { language } = useSettings();

  return (
    <SettingsStack.Navigator screenOptions={HeaderScreenOptions}>
      <SettingsStack.Screen name={t("Settings")} component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
};

export default SettingsStackNavigator;
