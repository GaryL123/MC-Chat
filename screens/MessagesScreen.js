import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Button, Alert } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { filter } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import messagesLogic from '../logic/messagesLogic';
import { Video, ResizeMode } from 'expo-av'; // If you want to support video playback
import { Image } from 'expo-image';
import MenuItem from '../components/MenuItem';
import ldStyles from '../assets/styles/LightDarkStyles';

const ios = Platform.OS == 'ios';

export default function MessagesScreen() {
    const { language, darkMode, profanityFilter, textSize } = useSettings();
    const { item, user, messages, textRef, media, scrollViewRef, sendMessage, GPT, sendMediaMessage } = messagesLogic();
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
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

    const handleReportMessage = async (message) => {
        Alert.alert(
            "Report Message",
            "Are you sure you want to report this message?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => reportMessage(message),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const renderMessageContent = (message, index) => {
        if ("text" in message) {
            return (
                <Text style={message.uid === user.uid ? (darkMode ? ldStyles.myMessageTextD : ldStyles.myMessageTextL) : (darkMode ? ldStyles.theirMessageTextD : ldStyles.theirMessageTextL)}>
                    {profanityFilter ? filter.clean(message.text) : message.text}
                </Text>
            );
        } else if ("mediaURL" in message) {
            const { mediaType, mediaURL } = message;
            if (mediaType.includes("image")) {
                return <Image source={{ uri: mediaURL }} style={styles.mediaImage} />
            } else if (mediaType.includes("video")) {
                return (
                    <View style={styles.container}>
                        <Video
                            ref={video}
                            style={styles.mediaVideo}
                            source={{
                                uri: mediaURL,
                            }}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            isLooping
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                        />
                        <View style={styles.buttons}>
                            <Button
                                title={status.isPlaying ? 'Pause' : 'Play'}
                                onPress={() =>
                                    status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                                }
                            />
                        </View>
                    </View>
                );
            } else {
                return (
                    <View style={styles.mediaContainer}>
                        <Feather name="file" size={32} color="gray" />
                        <Text>Unsupported media type</Text>
                    </View>
                );
            }
        } else {
            return (
                <Text style={[darkMode ? ldStyles.theirMessageTextD : ldStyles.theirMessageTextL, { fontSize: textSize }]}>
                    Unknown message type
                </Text>
            );
        }
    };

    const normalizeDate = (timestamp) => {
        if (!timestamp) {
            return '';
        }

        if (timestamp.toDate) {
            return timestamp.toDate().toISOString();
        }

        if (timestamp instanceof Date) {
            return timestamp.toISOString();
        }

        if (typeof timestamp === 'number') {
            return new Date(timestamp).toISOString();
        }

        if (typeof timestamp === 'string') {
            return new Date(timestamp).toISOString();
        }

        if (typeof timestamp === 'object') {
            return new Date(timestamp).toISOString();
        }

        return '';
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

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[darkMode ? ldStyles.screenD : ldStyles.screenL, { fontSize: textSize }]} keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}>
            <ScrollView contentContainerStyle={styles.messageListContainer} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                {combinedMessages.map((message, index) => (
                    message.uid !== user.uid ? (
                        <Menu key={index}>
                            <MenuTrigger style={[styles.messageItemContainer, { justifyContent: message.uid === user.uid ? 'flex-end' : 'flex-start' }]}>
                                <View style={[styles.messageBubble, message.uid === user.uid ? (darkMode ? ldStyles.myMessageD : ldStyles.myMessageL) : (darkMode ? ldStyles.theirMessageD : ldStyles.theirMessageL)]}>
                                    {renderMessageContent(message, index)}
                                </View>
                            </MenuTrigger>
                            <MenuOptions customStyles={{ optionsContainer: darkMode ? ldStyles.menuReportStyleD : ldStyles.menuReportStyleL }}>
                                <MenuItem text="Report" action={() => handleReportMessage(message)} />
                            </MenuOptions>
                        </Menu>
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
                <TouchableOpacity onPress={handleSendDoc} style={[darkMode ? ldStyles.circleButtonD : ldStyles.circleButtonL, { fontSize: textSize }]}>
                    <Feather name="plus" size={24} color="#737373" />
                </TouchableOpacity>
                <TextInput
                    onChangeText={handleInputChange}
                    onContentSizeChange={handleContentSizeChange}
                    placeholder="Type a message..."
                    placeholderTextColor="gray"
                    style={[darkMode ? ldStyles.textInputD : ldStyles.textInputL, { height: Math.max(35, Math.min(100, inputHeight)) }, { fontSize: textSize }]} // Set min and max height
                    value={inputText}
                    multiline={true} // Enable multiline input
                    scrollEnabled={true} // Allow scrolling inside the input
                    keyboardAppearance={darkMode ? 'dark' : 'light'}
                />
                <TouchableOpacity onPress={handleGPT} style={[darkMode ? ldStyles.circleButtonD : ldStyles.circleButtonL, { fontSize: textSize }]}>
                    <Image source={require('../assets/openai.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSendMessage} style={[darkMode ? ldStyles.circleButtonD : ldStyles.circleButtonL, { fontSize: textSize }]}>
                    <Feather name="send" size={24} color="#737373" />
                </TouchableOpacity>
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
    mediaContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
});
