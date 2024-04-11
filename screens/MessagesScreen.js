import { View, Button, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, StyleSheet } from 'react-native'
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import messagesLogic from '../logic/messagesLogic';

const ios = Platform.OS == 'ios';

export default function MessagesScreen() {
    const { user, messages, textRef, inputRef, scrollViewRef, updateScrollView, createChatIfNotExists, handleSendMessage } = messagesLogic();
    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params;

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: item?.fName + ' ' + item?.lName, // Set dynamic title
            headerRight: () => (
                <View style={styles.headerButtonsContainer}>
                    <Button
                        onPress={() => {/* Handle voice call */}}
                        title="Call"
                        color="#fff" // Adjust as necessary
                    />
                    <Button
                        onPress={() => {/* Handle video call */}}
                        title="Video"
                        color="#fff" // Adjust as necessary
                    />
                </View>
            ),
            headerTintColor: '#fff', // Adjust colors as needed
            headerStyle: {
                backgroundColor: '#166939', // Or any other color
            },
        });
    }, [navigation, item]);

    const MessageList = ({ messages, user }) => {
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.messageListContainer}>
                {messages.map((message, index) => (
                    <MessageItem message={message} key={index} user={user} />
                ))}
            </ScrollView>
        );
    };

    const MessageItem = ({ message, user }) => {
        const isMyMessage = user?.uid == message?.uid;
        return (
            <View style={[styles.messageItemContainer, { justifyContent: isMyMessage ? 'flex-end' : 'flex-start' }]}>
                <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.theirMessage]}>
                    <Text style={styles.messageText}>
                        {message?.text}
                    </Text>
                </View>
            </View>
        );
    };

    const CustomKeyboardView = ({ children, inChat }) => {
        const keyboardVerticalOffset = inChat ? 90 : 0;
        return (
            <KeyboardAvoidingView behavior={ios ? 'padding' : 'height'} style={styles.flex} keyboardVerticalOffset={keyboardVerticalOffset}>
                <ScrollView style={styles.flex} bounces={false} showsVerticalScrollIndicator={false}>
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        );
    };

    return (
        <CustomKeyboardView inChat={true}>
            <View style={styles.flexWhite}>
                <StatusBar style="dark" />
                <View style={styles.divider} />
                <View style={styles.chatContainer}>
                    <MessageList messages={messages} user={user} />
                    <View style={styles.inputContainer}>
                        <View style={styles.inputRow}>
                            <TextInput
                                onChangeText={value => textRef.current = value}
                                placeholder='Type a message...'
                                placeholderTextColor={'gray'}
                                style={styles.textInput}
                            />
                            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                                <Feather name="send" size={24} color="#737373" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
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
        borderBottomColor: '#e0e0e0',
    },
    chatContainer: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
    },
    messageListContainer: {
        paddingTop: 10,
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
        backgroundColor: '#5b61b9',
        borderColor: '#5058a9',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: hp(2.7),
        paddingTop: 8,
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
