import React from 'react';
import { View, Text } from 'react-native';
import { useSettings } from '../logic/settingsContext';
import { getldStyles } from '../assets/styles/LightDarkStyles';

export default function ChatsCreateScreen() {
  const { language, darkMode, profanityFilter, textSize } = useSettings();
  const ldStyles = getldStyles(textSize);

  return (
    <View style={darkMode ? ldStyles.screenD : ldStyles.screenL}>
      <View style={ldStyles.loserContainer}>
        <Text style={darkMode ? ldStyles.nameTextD : ldStyles.nameTextL}>Placeholder</Text>
      </View>
    </View>
  );
}