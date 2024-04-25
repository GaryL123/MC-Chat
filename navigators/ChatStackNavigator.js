import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatsScreen from '../screens/ChatsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ChatsCreateScreen from '../screens/ChatsCreateScreen';
import { HeaderScreenOptions } from './navigationConfig';
import translations from '../assets/styles/Translations';
import { useSettings } from '../logic/settingsContext';

const ChatStack = createStackNavigator();

const ChatStackNavigator = () => {
    const t = (key) => translations[key][language] || translations[key]['English'];
    const { language } = useSettings();

    return (
        <ChatStack.Navigator screenOptions={HeaderScreenOptions}>
            <ChatStack.Screen name={t("Chats")} component={ChatsScreen} />
            <ChatStack.Screen name={t("Messages")} component={MessagesScreen} />
            <ChatStack.Screen name={t("New Group Chat")} component={ChatsCreateScreen} />
        </ChatStack.Navigator>
    );
};

export default ChatStackNavigator;
