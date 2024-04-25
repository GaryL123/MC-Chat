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
import translations from '../assets/styles/Translations';
import { useSettings } from '../logic/settingsContext';

const RoomStack = createStackNavigator();

const RoomStackNavigator = () => {
  const t = (key) => translations[key][language] || translations[key]['English'];
  const { language } = useSettings();

  return (
    <RoomStack.Navigator screenOptions={HeaderScreenOptions}>
      <RoomStack.Screen name={t("Rooms")} component={RoomsScreen} />
      <RoomStack.Screen name={t("Add Users")} component={RoomsAddUserScreen} />
      <RoomStack.Screen name={t("Remove Users")} component={RoomsRemUserScreen} />
      <RoomStack.Screen name={t("Add Admins")} component={RoomsAddAdminScreen} />
      <RoomStack.Screen name={t("Room Settings")} component={RoomsSettingsScreen} />
      <RoomStack.Screen name="MessagesRoom" component={MessagesRoomScreen} />
      <RoomStack.Screen name={t("Create a Room")} component={RoomsCreateScreen} />
    </RoomStack.Navigator>
  );
};

export default RoomStackNavigator;
