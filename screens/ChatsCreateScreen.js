import React from 'react';
import { View, Text } from 'react-native';
import { getldStyles } from '../assets/styles/LightDarkStyles';

export default function ChatsCreateScreen() {
  const ldStyles = getldStyles(textSize);
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Home!</Text>
    </View>
  );
}