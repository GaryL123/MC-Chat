import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform, Button, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons, Feather, Entypo } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import messagesRoomLogic from '../logic/messagesRoomLogic';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const ios = Platform.OS == 'ios';

export default function MessagesRoomScreen() {
    const { roomId, roomName, user, messages, inputRef, scrollViewRef, updateScrollView, textRef, sendMessage, sendDoc, isAdmin } = messagesRoomLogic();
    const [inputText, setInputText] = useState('');  // Manage input text directly
    const [inputHeight, setInputHeight] = useState(35); // Initial height of the input field
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: roomName,
            headerRight: () => (
                <TouchableOpacity>
                    <View style={styles.container}>
                        <View>
                            <Menu>
                                <MenuTrigger>
                                    <Entypo name="dots-three-vertical" size={24} color="white" />
                                </MenuTrigger>
                                <MenuOptions customStyles={{ optionsContainer: styles.menuOptionsStyle }}>
                                    {isAdmin && (
                                        <>
                                            <MenuItem
                                                text="Add Users"
                                                action={() => navigation.navigate('Add Users', { roomId })}
                                                value={null}
                                                icon={<Ionicons name="person-add-outline" size={hp(2.5)} color="gray" />}
                                            />
                                            <Divider />
                                            <MenuItem
                                                text="Remove Users"
                                                action={() => navigation.navigate('Remove Users', { roomId })}
                                                value={null}
                                                icon={<Ionicons name="person-remove-outline" size={hp(2.5)} color="gray" />}
                                            />
                                            <Divider />
                                            <MenuItem
                                                text="Room Settings"
                                                action={() => navigation.navigate('Room Settings', { roomId })}
                                                value={null}
                                                icon={<Ionicons name="settings-outline" size={hp(2.5)} color="gray" />}
                                            />
                                            <Divider />
                                        </>
                                    )}
                                    <MenuItem
                                        text="Leave Room"
                                        action={() => {/* handle leaving the room */ }}
                                        value={null}
                                        icon={<Ionicons name="exit-outline" size={hp(2.5)} color="gray" />}
                                    />
                                </MenuOptions>
                            </Menu>
                        </View>
                    </View>
                </TouchableOpacity>
            ),
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#166939',
                height: 120,
            },
        });
    }, [navigation, roomId, isAdmin]);

    const handleSendMessage = async () => {
        await sendMessage();
        setInputText("");  // Ensure to clear the controlled input text state
    };

    const handleSendDoc = async () => {
        await sendDoc();
    }

    // Update this state when AI generates a reply
    /*const handleGPT = async () => {
        const reply = await GPT();
        setInputText(reply);  // Set input field text with AI reply
        textRef.current = reply;
    };*/

    // Any text changes in the input are handled here
    const handleInputChange = (text) => {
        setInputText(text);  // Update state with text input by user
        textRef.current = text;  // Keep ref updated if needed elsewhere
    };

    const handleContentSizeChange = (event) => {
        setInputHeight(event.nativeEvent.contentSize.height);  // Adjust height based on content size
    };

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

    const Divider = () => {
        return (
            <View style={styles.divider2} />
        );
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flexWhite} keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.messageListContainer} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                {messages.map((message, index) => (
                    <View key={index} style={[styles.messageItemContainer, { justifyContent: message.uid === user.uid ? 'flex-end' : 'flex-start' }]}>
                        {message.uid !== user.uid && (
                            <Text style={styles.senderName}>{message.senderFName + ' ' + message.senderLName}</Text>  // Assuming 'senderName' is part of the message object
                        )}
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
                        onContentSizeChange={handleContentSizeChange} // Separate handler for size changes
                        placeholder='Type a message...'
                        placeholderTextColor={'gray'}
                        style={[styles.textInput, { height: Math.max(35, Math.min(100, inputHeight)) }]} // Set min and max height
                        value={inputText}
                        multiline={true} // Enable multiline input
                        scrollEnabled={true} // Allow scrolling inside the input
                    />
                {/*<TouchableOpacity onPress={handleGPT} style={styles.sendButton}>
                    <Image source={require('../assets/openai.png')} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>*/}
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
    divider2: {
        height: 1, // equivalent to p-[1px] in Tailwind for height
        width: '100%', // w-full in Tailwind
        backgroundColor: '#e2e8f0',  // This color corresponds to Tailwind's bg-neutral-200
    },
    chatContainer: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
    },
    messageListContainer: {
        paddingTop: 15,
        paddingBottom: 60, // Ensure this is enough space for the input container
    },
    messageItemContainer: {
        flexDirection: 'column',
        marginBottom: 10,
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
    headerButtonsContainer: {
        flexDirection: 'row',
        marginRight: 10
    },
    senderName: {
        alignSelf: 'flex-start',
        marginBottom: 4,
        fontSize: 14,
        color: 'grey',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 30,  // Approximation of rounded-b-3xl in Tailwind
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuOptionsStyle: {
        borderRadius: 10,
        marginTop: 30,
        marginLeft: -10,
        backgroundColor: 'white',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 0 },
        width: 190
    },
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
