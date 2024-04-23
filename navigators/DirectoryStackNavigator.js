import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DirectoryScreen from '../screens/DirectoryScreen';
import { HeaderScreenOptions } from './navigationConfig';

const DirectoryStack = createStackNavigator();

const DirectoryStackNavigator = () => (
  <DirectoryStack.Navigator screenOptions={HeaderScreenOptions}>
    <DirectoryStack.Screen name="Directory" component={DirectoryScreen} />
  </DirectoryStack.Navigator>
);

export default DirectoryStackNavigator;
