import React from 'react';
import { View, Text } from 'react-native';
import ldStyles from '../assets/styles/LightDarkStyles';

const NotificationBubble = ({ count }) => {
  return (
    <View style={ldStyles.notificationBubble}>
      <Text style={ldStyles.notificationText}>{count}</Text>
    </View>
  );
};

export default NotificationBubble;