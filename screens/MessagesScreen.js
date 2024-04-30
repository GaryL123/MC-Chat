import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Button, Linking, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as dp } from 'react-native-responsive-screen';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { filter, getChatId, normalizeDate } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import messagesLogic from '../logic/messagesLogic';
import { Video, ResizeMode } from 'expo-av';
import { Image } from 'expo-image';
import MenuItem from '../components/MenuItem';
import { getldStyles } from '../assets/styles/LightDarkStyles';
import ActionSheet from 'react-native-actionsheet';



const ios = Platform.OS == 'ios';

export default function MessagesScreen() {
    const { language, darkMode, profanityFilter, textSize } = useSettings();
    const { item, user, messages, textRef, media, scrollViewRef, sendMessage, sendMediaMessage, reportMessage, startRecording, stopRecording, sendVoiceMessage, unreportMessage, GPT } = messagesLogic();
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [inputText, setInputText] = useState('');
    const [inputHeight, setInputHeight] = useState(35);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const chatId = getChatId(user?.uid, item?.uid);
    const navigation = useNavigation();
    const ldStyles = getldStyles(textSize);

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

    const actionSheetRef = useRef(null);

    const showActionSheet = (item) => {
        setTimeout(() => actionSheetRef.current.show(), 0); 
    };

    const handleAction = (index) => {
        if (index === 0) { 
            handleStartRecording();
        } else if (index === 1) { 
            handleStopRecording();
        } else if (index === 2) {
            sendVoiceMessage();
        } else if (index === 3) { 
            console.log('close pressed');
        }
    };

    const handlePressMessage = async (message) => {
        setSelectedMessage(message.id);
    }

    const handleReportMessage = async (message, isReported) => {
        const confirmAction = isReported ? 'Unreport' : 'Report';
        const textMessage = "text" in message;

        Alert.alert(
            `${confirmAction} Message`,
            `Are you sure you want to ${confirmAction.toLowerCase()} this message?`,
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes", onPress: () => {
                        if (isReported) {
                            unreportMessage(textMessage, chatId, message);
                        } else {
                            reportMessage(textMessage, chatId, message);
                        }
                    },
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const normalizedMessages = messages.map((msg) => ({
        ...msg,
        createdAt: normalizeDate(msg.createdAt),
    }));

    const normalizedMedia = media.map((med) => ({
        ...med,
        createdAt: normalizeDate(med.createdAt),
    }));

    const combinedMessages = [...normalizedMessages, ...normalizedMedia].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    const handleSendMessage = async () => {
        await sendMessage();
        setInputText("");
    };

    const handleSendDoc = async () => {
        await sendMediaMessage();
    }

    const handleDownloadFile = (url) => {
        try {
            // Open the URL in the browser
            Linking.openURL(url);
        } catch (error) {
            Alert.alert("Error", "Unable to open the file download link.");
        }
    };
    const handleGPT = async () => {
        const reply = await GPT();
        setInputText(reply);
        textRef.current = reply;
    };

    const handleInputChange = (text) => {
        setInputText(text);
        textRef.current = text;
    };

    const handleContentSizeChange = (event) => {
        setInputHeight(event.nativeEvent.contentSize.height);
    };
    const handleStartRecording = async () => {
        await startRecording();
    };

    const handleStopRecording = async () => {
        await stopRecording();
    };

    const renderMessageContent = (message) => {
        if ("text" in message) {
            return (
                <Text style={message.uid === user.uid ? (darkMode ? ldStyles.myMessageTextD : ldStyles.myMessageTextL) : (darkMode ? ldStyles.theirMessageTextD : ldStyles.theirMessageTextL)}>
                    {message.reportedBy?.includes(user?.uid) || message.reportCount >= 3 ? '*****' : (profanityFilter ? filter.clean(message.text) : message.text)}
                </Text>
            );
        } else if ("mediaURL" in message) {
            const { mediaType, mediaURL } = message;
            if (mediaType.includes("image")) {
                return (
                    <View>
                        {!message.reportedBy?.includes(user?.uid) ? (
                            <Image source={{ uri: mediaURL }} style={styles.mediaImage} />
                        ) : (
                            <Text style={(darkMode ? ldStyles.myMessageTextD : ldStyles.myMessageTextL)}>This image has been reported</Text>
                        )}
                    </View>
                );
            } else if (mediaType.includes("video")) {
                return message.reportedBy?.includes(user?.uid) ? (
                    <Text style={(darkMode ? ldStyles.myMessageTextD : ldStyles.myMessageTextL)}>This video has been reported</Text>
                ) : (
                    <View style={styles.container}>
                        <Video
                            ref={video}
                            style={styles.mediaVideo}
                            source={{ uri: mediaURL }}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            isLooping
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                        />
                    </View>
                );
            } else if (mediaType.includes("audio")) {
                return message.reportedBy?.includes(user?.uid) ? (
                    <Text style={darkMode ? ldStyles.myMessageTextD : ldStyles.myMessageTextL}>This audio has been reported</Text>
                ) : (
                    <View style={styles.container}>
                        <Video
                            ref={video}
                            style={styles.mediaAudio}
                            source={{ uri: mediaURL }}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            isLooping
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                        />
                    </View>
                );
            } else {
                return (
                    <TouchableOpacity onPress={() => handleDownloadFile(mediaURL)}>
                        <Text style={darkMode ? ldStyles.myMessageTextD : ldStyles.myMessageTextL}>
                            <Feather name="file" size={24} color="#737373" /> Download File: {message.fileName}
                        </Text>
                    </TouchableOpacity>
                );
            }
        } else {
            return (
                <Text style={[darkMode ? ldStyles.theirMessageTextD : ldStyles.theirMessageTextL]}>
                    Unknown message type
                </Text>
            );
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[darkMode ? ldStyles.screenD : ldStyles.screenL]} keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}>
            <ScrollView contentContainerStyle={styles.messageListContainer} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                {combinedMessages.map((message, index) => (
                    message.uid !== user.uid ? (
                        <TouchableOpacity key={message.id || index} onLongPress={() => handlePressMessage(message)}>
                            <View style={[styles.messageItemContainer, { justifyContent: message.uid === user.uid ? 'flex-end' : 'flex-start' }]}>
                                <View style={[styles.messageBubble, message.uid === user.uid ? (darkMode ? ldStyles.myMessageD : ldStyles.myMessageL) : (darkMode ? ldStyles.theirMessageD : ldStyles.theirMessageL)]}>
                                    {renderMessageContent(message)}
                                </View>
                            </View>
                            <Menu opened={selectedMessage === message.id} onBackdropPress={() => setSelectedMessage(null)}>
                                <MenuTrigger />
                                <MenuOptions customStyles={{ optionsContainer: darkMode ? ldStyles.menuReportStyleD : ldStyles.menuReportStyleL }}>
                                    <MenuItem text={message.reportedBy && message.reportedBy.includes(user?.uid) ? "Unreport" : "Report"} action={() => handleReportMessage(message, message.reportedBy && message.reportedBy.includes(user?.uid))} />
                                </MenuOptions>
                            </Menu>
                        </TouchableOpacity>
                    ) : (
                        <View key={index} style={[styles.messageItemContainer, { justifyContent: 'flex-end' }]}>
                            <View style={[styles.messageBubble, darkMode ? ldStyles.myMessageD : ldStyles.myMessageL]}>
                                {renderMessageContent(message, index)}
                            </View>
                        </View>
                    )
                ))}
            </ScrollView>

            <View style={darkMode ? ldStyles.inputContainerD : ldStyles.inputContainerL}>
                <TouchableOpacity>
                    <View style={darkMode ? ldStyles.circleButtonD : ldStyles.circleButtonL}>
                        <View>
                            <Menu>
                                <MenuTrigger>
                                    <Feather name="plus" size={24} color="#737373" />
                                </MenuTrigger>
                                <MenuOptions customStyles={{ optionsContainer: darkMode ? ldStyles.mediaMenusStyleD : ldStyles.mediaMenusStyleL }}>
                                    <MenuItem
                                        action={handleSendDoc}
                                        value={null}
                                        icon={<Ionicons name="mail" size={dp(2.5)} color='gray' />}
                                    />
                                    <MenuItem
                                        action={() => showActionSheet(item)}
                                        value={null}
                                        icon={<Ionicons name="mic-circle" size={dp(2.5)} color='gray' />}
                                    />
                                </MenuOptions>
                            </Menu>
                        </View>
                    </View>
                </TouchableOpacity>
                <TextInput
                    onChangeText={handleInputChange}
                    onContentSizeChange={handleContentSizeChange}
                    placeholder='Type a message...'
                    placeholderTextColor={'gray'}
                    style={[darkMode ? ldStyles.textInputD : ldStyles.textInputL, { height: Math.max(35, Math.min(100, inputHeight)) }]}
                    value={inputText}
                    multiline={true}
                    scrollEnabled={true}
                    keyboardAppearance={darkMode ? 'dark' : 'light'}
                />
                <TouchableOpacity onPress={handleGPT} style={[darkMode ? ldStyles.circleButtonD : ldStyles.circleButtonL]}>
                    <Image source={require('../assets/openai.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSendMessage} style={[darkMode ? ldStyles.circleButtonD : ldStyles.circleButtonL]}>
                    <Feather name="send" size={24} color="#737373" />
                </TouchableOpacity>
                <ActionSheet
                    ref={actionSheetRef}
                    style={[darkMode ? ldStyles.circleButtonD : ldStyles.circleButtonL]}
                    title={'What would you like to do?'}
                    options={['Start Recording', 'Stop Recording', 'Send Recording', 'Close']}
                    cancelButtonIndex={3}
                    onPress={(index) => handleAction(index)}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    messageListContainer: {
        paddingTop: 15,
        paddingBottom: 60,
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
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        marginRight: 8,
        marginLeft: 8,
        paddingLeft: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 12,
        minHeight: 35
    },
    sendButton: {
        padding: 8,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        backgroundColor: '#e0e0e0',
    },

    mediaImage: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1,
        borderRadius: 10,
    },
    mediaVideo: {
        width: '100%',
        height: 150,
        aspectRatio: 1,
        borderRadius: 10,
    },
    mediaAudio: {
        width: '100%',
        height: 150,
        aspectRatio: 1,
        borderRadius: 10,
    },
    mediaContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
});