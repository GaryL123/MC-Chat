import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RoomsInvitesScreen from '../screens/RoomsInvitesScreen';
import { HeaderScreenOptions } from './navigationConfig';
import translations from '../assets/styles/Translations';
import { useSettings } from '../logic/settingsContext';

const RoomInvitesStack = createStackNavigator();

const RoomInvitesStackNavigator = () => {
  const t = (key) => translations[key][language] || translations[key]['English'];
  const { language } = useSettings();

  return (
    <RoomInvitesStack.Navigator screenOptions={HeaderScreenOptions}>
      <RoomInvitesStack.Screen name={t("Room Invites")} component={RoomsInvitesScreen} />
    </RoomInvitesStack.Navigator>
  );
};

export default RoomInvitesStackNavigator;
