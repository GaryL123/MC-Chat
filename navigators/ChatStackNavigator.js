import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatsScreen from '../screens/ChatsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import { HeaderScreenOptions } from './navigationConfig';


const ChatStack = createStackNavigator();

const ChatStackNavigator = () => (
    <ChatStack.Navigator screenOptions={HeaderScreenOptions}>
        <ChatStack.Screen name="Chats" component={ChatsScreen} />
        <ChatStack.Screen name="Messages" component={MessagesScreen} />
    </ChatStack.Navigator>
);

export default ChatStackNavigator;
