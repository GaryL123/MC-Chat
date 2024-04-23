import React from 'react';
import { View, Text } from 'react-native';
import ldStyles from '../assets/styles/LightDarkStyles';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Home!</Text>
    </View>
  );
}
