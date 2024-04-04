import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SettingsHeader from '../../components/SettingsHeader';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Initial font size

  const toggleSwitch = () => setIsDarkMode(previousState => !previousState);

  const decreaseFontSize = () => {
    if (fontSize > 10) {
      setFontSize(prevSize => prevSize - 2);
    }
  };

  const increaseFontSize = () => {
    if (fontSize < 30) {
      setFontSize(prevSize => prevSize + 2);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <SettingsHeader router={router} />
      <View style={{ alignItems: 'center', marginTop: hp('10%') }}>
        <Text style={{ fontSize: fontSize, marginBottom: 10 }}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isDarkMode}
        />
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <TouchableOpacity onPress={decreaseFontSize}>
            <Text style={{ fontSize: 20 }}>-</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, marginHorizontal: 10 }}>Font Size: {fontSize}</Text>
          <TouchableOpacity onPress={increaseFontSize}>
            <Text style={{ fontSize: 20 }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
