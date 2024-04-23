import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform, Button, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import messagesLogic from '../logic/messagesLogic';

const ios = Platform.OS == 'ios';

export default function MessagesScreen() {
    const { item, user, messages, textRef, inputRef, scrollViewRef, sendMessage, sendDoc, GPT } = messagesLogic();
    const [inputText, setInputText] = useState('');  // Manage input text directly
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: item?.fName + ' ' + item?.lName,
            headerRight: () => (
                <View style={{ flexDirection: 'row', paddingRight: 10 }}>
                    <TouchableOpacity onPress={() => {/* Handle voice call */ }} style={{ marginRight: 15 }}>
                        <Feather name="phone" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {/* Handle video call */ }}>
                        <Feather name="video" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            ),
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#166939',
                height: 120,
            },
        });
    }, [navigation, item]);

    const handleSendMessage = async () => {
        await sendMessage();
        setInputText("");  // Ensure to clear the controlled input text state
    };

    const handleSendDoc = async () => {
        await sendDoc();
    }

    // Update this state when AI generates a reply
    const handleGPT = async () => {
        const reply = await GPT();
        setInputText(reply);  // Set input field text with AI reply
        textRef.current = reply;
    };

    // Any text changes in the input are handled here
    const handleInputChange = (text) => {
        setInputText(text);  // Update state with text input by user
        textRef.current = text;  // Keep ref updated if needed elsewhere
    };

    return (
        <KeyboardAvoidingView behavior={ios ? 'padding' : 'height'} style={styles.flexWhite} keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.messageListContainer} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                {messages.map((message, index) => (
                    <View key={index} style={[styles.messageItemContainer, { justifyContent: message.uid === user.uid ? 'flex-end' : 'flex-start' }]}>
                        <View style={[styles.messageBubble, message.uid === user.uid ? styles.myMessage : styles.theirMessage]}>
                            <Text style={message.uid === user.uid ? styles.myMessageText : styles.theirMessageText}>
                                {message.text}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={handleSendDoc} style={styles.sendButton}>
                    <Feather name="plus" size={24} color="#737373" />
                </TouchableOpacity>
                <TextInput
                    onChangeText={handleInputChange}
                    placeholder='Type a message...'
                    placeholderTextColor={'gray'}
                    style={styles.textInput}
                    value={inputText}  // Controlled component
                />
                <TouchableOpacity onPress={handleGPT} style={styles.sendButton}>
                    <Image source={require('../assets/openai.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                    <Feather name="send" size={24} color="#737373" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    flexWhite: {
        flex: 1,
        backgroundColor: 'white',
    },
    divider: {
        height: 3,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
    },
    chatContainer: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
    },
    messageListContainer: {
        paddingBottom: 60, // Ensure this is enough space for the input container
    },
    messageItemContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        marginHorizontal: 12,
    },
    messageBubble: {
        maxWidth: wp(80),
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
    },
    myMessage: {
        backgroundColor: 'white',
        borderColor: '#e0e0e0',
        alignSelf: 'flex-end',
    },
    theirMessage: {
        backgroundColor: '#e0e0e0',
        borderColor: 'lightgray',
        alignSelf: 'flex-start',
    },
    myMessageText: {
        fontSize: 16,
        color: "black",
    },
    theirMessageText: {
        fontSize: 16,
        color: "black",
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        borderTopWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: 'white',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 30,
        padding: 8,
        marginHorizontal: 12,
    },
    textInput: {
        flex: 1,
        marginRight: 8,
        paddingLeft: 20,
        fontSize: 16,
    },
    sendButton: {
        padding: 8,
        marginRight: 1,
        borderRadius: 30,
        backgroundColor: '#e0e0e0',
    },
    headerButtonsContainer: {
        flexDirection: 'row',
        marginRight: 10
    },
});
