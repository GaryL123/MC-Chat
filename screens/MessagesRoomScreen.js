import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons, Feather, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { filter } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import ldStyles from '../assets/styles/LightDarkStyles';
import messagesRoomLogic from '../logic/messagesRoomLogic';
import MenuItem from '../components/MenuItem';

const ios = Platform.OS == 'ios';

export default function MessagesRoomScreen() {
    const { language, darkMode, profanityFilter, textSize } = useSettings();
    const { roomId, roomName, roomFilter, roomPublic, user, messages, inputRef, scrollViewRef, updateScrollView, textRef, sendMessage, sendDoc, isAdmin } = messagesRoomLogic();
    const [inputText, setInputText] = useState('');  // Manage input text directly
    const [inputHeight, setInputHeight] = useState(35); // Initial height of the input field
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: roomName,
            headerRight: () => (
                <TouchableOpacity>
                    <View style={ldStyles.menuContainer}>
                        <View>
                            <Menu>
                                <MenuTrigger>
                                    <Entypo name="dots-three-vertical" size={24} color="white" />
                                </MenuTrigger>
                                <MenuOptions customStyles={{ optionsContainer: darkMode ? ldStyles.menuOptionsStyleD : ldStyles.menuOptionsStyleL }}>
                                    {isAdmin && (
                                        <>
                                            <MenuItem
                                                text="Add Users"
                                                action={() => navigation.navigate('Add Users', { roomId })}
                                                value={null}
                                                icon={<Ionicons name="person-add-outline" size={hp(2.5)} color="gray" />}
                                            />
                                            <MenuItem
                                                text="Remove Users"
                                                action={() => navigation.navigate('Remove Users', { roomId })}
                                                value={null}
                                                icon={<Ionicons name="person-remove-outline" size={hp(2.5)} color="gray" />}
                                            />
                                            <MenuItem
                                                text="Add Admins"
                                                action={() => navigation.navigate('Add Admins', { roomId })}
                                                value={null}
                                                icon={<Ionicons name="person-add" size={hp(2.5)} color="gray" />}
                                            />
                                            <MenuItem
                                                text="Room Settings"
                                                action={() => navigation.navigate('Room Settings', { roomId })}
                                                value={null}
                                                icon={<Ionicons name="settings-outline" size={hp(2.5)} color="gray" />}
                                            />
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
                shadowOpacity: 0,
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

    const handleInputChange = (text) => {
        setInputText(text);  // Update state with text input by user
        textRef.current = text;  // Keep ref updated if needed elsewhere
    };

    const handleContentSizeChange = (event) => {
        setInputHeight(event.nativeEvent.contentSize.height);  // Adjust height based on content size
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={darkMode ? ldStyles.screenD : ldStyles.screenL} keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}>
            <ScrollView contentContainerStyle={styles.messageListContainer} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                {messages.map((message, index) => (
                    <View key={index} style={[styles.messageItemContainer, { justifyContent: message.uid === user.uid ? 'flex-end' : 'flex-start' }]}>
                        {message.uid !== user.uid && (<Text style={styles.senderName}>{message.senderFName + ' ' + message.senderLName}</Text>)}
                        <View style={[styles.messageBubble, message.uid === user.uid ? (darkMode ? ldStyles.myMessageD : ldStyles.myMessageL) : (darkMode ? ldStyles.theirMessageD : ldStyles.theirMessageL)]}>
                            <Text style={message.uid === user.uid ? (darkMode ? ldStyles.myMessageTextD : ldStyles.myMessageTextL) : (darkMode ? ldStyles.theirMessageTextD : ldStyles.theirMessageTextL)}>
                                {(profanityFilter || roomFilter) ? filter.clean(message.text) : message.text}
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
                    keyboardAppearance={darkMode ? 'dark' : 'light'}
                />
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
    senderName: {
        alignSelf: 'flex-start',
        marginBottom: 4,
        fontSize: 14,
        color: 'grey',
    },
});
