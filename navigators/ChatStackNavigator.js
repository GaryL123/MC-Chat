import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatsScreen from '../screens/ChatsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ChatsCreateScreen from '../screens/ChatsCreateScreen';
import { HeaderScreenOptions } from './navigationConfig';

const ChatStack = createStackNavigator();

const ChatStackNavigator = () => (
    <ChatStack.Navigator screenOptions={HeaderScreenOptions}>
        <ChatStack.Screen name="Chats" component={ChatsScreen} />
        <ChatStack.Screen name="Messages" component={MessagesScreen} />
        <ChatStack.Screen name="New Group Chat" component={ChatsCreateScreen} />
    </ChatStack.Navigator>
);

export default ChatStackNavigator;
