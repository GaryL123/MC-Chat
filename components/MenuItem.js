import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MenuOption } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const MenuItem = ({ text, action, value, icon, customContent }) => {
  return (
    <MenuOption onSelect={() => action(value)}>
      <View style={styles.menuItem}>
        <Text style={styles.menuItemText}>
          {text}
        </Text>
        {customContent ? customContent : icon}
      </View>
    </MenuOption>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: hp(1.7),
    fontWeight: '600',
    color: '#4a5568',  // This color corresponds to Tailwind's text-neutral-600
  },
});

export default MenuItem;