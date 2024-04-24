import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MenuOption } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSettings } from '../logic/settingsContext';
import ldStyles from '../assets/styles/LightDarkStyles';

const MenuItem = ({ text, action, value, icon, customContent }) => {
  const { language, darkMode, textSize } = useSettings();

  return (
    <MenuOption onSelect={() => action(value)}>
      <View style={ldStyles.menuItem}>
        <Text style={darkMode ? ldStyles.menuItemTextD : ldStyles.menuItemTextL}>
          {text}
        </Text>
        {customContent ? customContent : icon}
      </View>
    </MenuOption>
  );
};

export default MenuItem;