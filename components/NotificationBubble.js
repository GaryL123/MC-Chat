import React from 'react';
import { View, Text } from 'react-native';
import { useSettings } from '../logic/settingsContext';
import { getldStyles } from '../assets/styles/LightDarkStyles';

const NotificationBubble = ({ count }) => {
  const { textSize } = useSettings();
  const ldStyles = getldStyles(textSize);
  
  return (
    <View style={ldStyles.notificationBubble}>
      <Text style={ldStyles.notificationText}>{count}</Text>
    </View>
  );
};

export default NotificationBubble;