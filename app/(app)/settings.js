import { View, Text, Switch } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SettingsHeader from '../../components/SettingsHeader';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSwitch = () => setIsDarkMode(previousState => !previousState);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <SettingsHeader router={router} />
      <View className="items-center mt-72">
        <Text className="text-lg mb-4">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isDarkMode}
        />
      </View>
    </View>
  );
}
