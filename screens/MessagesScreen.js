import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform, Button, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { filter } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import messagesLogic from '../logic/messagesLogic';
import ldStyles from '../assets/styles/LightDarkStyles';

const ios = Platform.OS == 'ios';

export default function MessagesScreen() {
    const { language, darkMode, profanityFilter, textSize } = useSettings();
    const { item, user, messages, textRef, inputRef, scrollViewRef, sendMessage, sendDoc, GPT } = messagesLogic();
    const [inputText, setInputText] = useState('');
    const [inputHeight, setInputHeight] = useState(35); // Initial height of the input field
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
                shadowOpacity: 0,
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

    const handleGPT = async () => {
        const reply = await GPT();
        setInputText(reply);  // Set input field text with AI reply
        textRef.current = reply;
    };

    const handleInputChange = (text) => {
        setInputText(text);  // Update the text state
        textRef.current = text;  // Keep ref updated if needed elsewhere
    };

    const handleContentSizeChange = (event) => {
        setInputHeight(event.nativeEvent.contentSize.height);  // Adjust height based on content size
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={darkMode ? ldStyles.screenD : ldStyles.screenL} keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}>
            <StatusBar style="dark-content" />
            <ScrollView contentContainerStyle={styles.messageListContainer} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                {messages.map((message, index) => (
                    <View key={index} style={[styles.messageItemContainer, { justifyContent: message.uid === user.uid ? 'flex-end' : 'flex-start' }]}>
                        <View style={[styles.messageBubble, message.uid === user.uid ? (darkMode ? ldStyles.myMessageD : ldStyles.myMessageL) : (darkMode ? ldStyles.theirMessageD : ldStyles.theirMessageL)]}>
                            <Text style={message.uid === user.uid ? (darkMode ? ldStyles.myMessageTextD : ldStyles.myMessageTextL) : (darkMode ? ldStyles.theirMessageTextD : ldStyles.theirMessageTextL)}>
                                {profanityFilter ? filter.clean(message.text) : message.text}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={darkMode ? ldStyles.inputContainerD : ldStyles.inputContainerL}>
                <TouchableOpacity onPress={handleSendDoc} style={darkMode ? ldStyles.circleButtonD : ldStyles.circleButtonL}>
                    <Feather name="plus" size={24} color="#737373" />
                </TouchableOpacity>
                <TextInput
                    onChangeText={handleInputChange}
                    onContentSizeChange={handleContentSizeChange} // Separate handler for size changes
                    placeholder='Type a message...'
                    placeholderTextColor={'gray'}
                    style={[darkMode ? ldStyles.textInputD : ldStyles.textInputL, { height: Math.max(35, Math.min(100, inputHeight)) }]} // Set min and max height
                    value={inputText}
                    multiline={true} // Enable multiline input
                    scrollEnabled={true} // Allow scrolling inside the input
                />
                <TouchableOpacity onPress={handleGPT} style={darkMode ? ldStyles.circleButtonD : ldStyles.circleButtonL}>
                    <Image source={require('../assets/openai.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSendMessage} style={darkMode ? ldStyles.circleButtonD : ldStyles.circleButtonL}>
                    <Feather name="send" size={24} color="#737373" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    messageListContainer: {
        paddingTop: 15,
        paddingBottom: 60, // Ensure this is enough space for the input container
    },
    messageItemContainer: {
        flexDirection: 'row',
        marginBottom: 4,
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
        alignItems: 'center',  // Ensure vertical alignment is centered
    },
    textInput: {
        flex: 1,
        marginRight: 8,
        marginLeft: 8,
        paddingLeft: 15,
        fontSize: 16,
        borderWidth: 1,  // Set border width to create the outline
        borderColor: '#e0e0e0',  // Set border color to match the send button background
        borderRadius: 20,  // Keep your rounded corners
        paddingVertical: 10,
        paddingHorizontal: 12,
        minHeight: 35 // Set a minimum height
    },
    sendButton: {
        padding: 8,
        width: 44,  // Assign a fixed width
        height: 44, // Assign a fixed height
        justifyContent: 'center', // Center the icon vertically and horizontally
        alignItems: 'center',
        borderRadius: 22,  // Half of width and height to create a circle
        backgroundColor: '#e0e0e0',
    },
});
