import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationBubble = ({ count }) => {
  return (
    <View style={styles.notificationBubble}>
      <Text style={styles.notificationText}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationBubble: {
    minWidth: 20,
    padding: 2,
    backgroundColor: 'red',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 10, // Adjust size as necessary
    padding: 1,
  }
});

export default NotificationBubble;
