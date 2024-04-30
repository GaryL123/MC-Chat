import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert, Linking } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { Ionicons, Feather, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { filter, normalizeDate } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import messagesRoomLogic from '../logic/messagesRoomLogic';
import messagesLogic from '../logic/messagesLogic';
import MenuItem from '../components/MenuItem';
import HeaderTitle from '../components/HeaderTitle';
import translations from '../assets/styles/Translations';
import { getldStyles } from '../assets/styles/LightDarkStyles';
import ActionSheet from 'react-native-actionsheet';
import { Video, ResizeMode } from 'expo-av';



const ios = Platform.OS == 'ios';

export default function MessagesRoomScreen() {
    const { language, darkMode, profanityFilter, textSize } = useSettings();
    const { roomId, roomPhoto, roomName, roomDesc, roomFilter, roomPublic, user, messages, inputRef, scrollViewRef, updateScrollView, textRef, sendMessage, sendDoc, isAdmin, leaveRoom } = messagesRoomLogic();
    const { item, media, sendMediaMessage, startRecording, stopRecording, sendVoiceMessage } = messagesLogic();
    const [inputText, setInputText] = useState('');
    const [inputHeight, setInputHeight] = useState(35);
    const navigation = useNavigation();
    const t = (key) => translations[key][language] || translations[key]['English'];
    const ldStyles = getldStyles(textSize);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: () => <HeaderTitle photo={roomPhoto} name={roomName} />,
            headerRight: () => (
                <TouchableOpacity>
                    <View style={ldStyles.menuContainer}>
                        <View>
                            <Menu>
                                <MenuTrigger>
                                    <Entypo name="dots-three-vertical" size={24} color="white" />
                                </MenuTrigger>
                                <MenuOptions customStyles={{ optionsContainer: [darkMode ? ldStyles.menuOptionsStyleD : ldStyles.menuOptionsStyleL] }}>
                                    {isAdmin && (
                                        <>
                                            <MenuItem
                                                text={t("Add Users")}
                                                action={() => navigation.navigate(t("Add Users"), { roomId })}
                                                value={null}
                                                icon={<Ionicons name="person-add-outline" size={hp(2.5)} color="gray" />}
                                            />
                                            <MenuItem
                                                text={t("Remove Users")}
                                                action={() => navigation.navigate(t("Remove Users"), { roomId })}
                                                value={null}
                                                icon={<Ionicons name="person-remove-outline" size={hp(2.5)} color="gray" />}
                                            />
                                            <MenuItem
                                                text={t("Add Admins")}
                                                action={() => navigation.navigate(t("Add Admins"), { roomId })}
                                                value={null}
                                                icon={<Ionicons name="person-add" size={hp(2.5)} color="gray" />}
                                            />
                                            <MenuItem
                                                text={t("Room Settings")}
                                                action={() => navigation.navigate(t("Room Settings"), { roomId, roomPhoto, roomName, roomDesc, roomFilter, roomPublic })}
                                                value={null}
                                                icon={<Ionicons name="settings-outline" size={hp(2.5)} color="gray" />}
                                            />
                                        </>
                                    )}
                                    <MenuItem
                                        text={t("Leave Room")}
                                        action={() => { handleLeaveRoom(roomId) }}
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

    const actionSheetRef = useRef(null);

    const showActionSheet = (item) => {
        setTimeout(() => actionSheetRef.current.show(), 0);
    };

    const handleAction = (index) => {
        if (index === 0) { // start recording
            handleStartRecording();
        } else if (index === 1) { // stop recording and send
            handleStopRecording();
        } else if (index === 2) {
            sendVoiceMessage();
        } else if (index === 3) { // close
            console.log('close pressed');
        }
    };

    const handleLeaveRoom = async (roomId) => {
        Alert.alert(
            "Leave Room",
            "Are you sure you want to leave this room?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        await leaveRoom(roomId)
                            .then(() => {
                                navigation.goBack();
                            })
                            .catch((error) => {
                                Alert.alert('Error', 'Failed to leave the room: ' + error.message);
                            });
                    },
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const handleSendMessage = async () => {
        await sendMessage();
        setInputText("");
    };

    const handleSendDoc = async () => {
        await sendDoc();
    }
    const handleSendMedia = async () => {
        await sendMediaMessage();
    }
    const handleDownloadFile = (url) => {
        try {
            // Open the URL in the default browser or associated app
            Linking.openURL(url);
        } catch (error) {
            Alert.alert("Error", "Unable to open the file download link.");
        }
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
                <Text style={message.uid === user.uid ? ([darkMode ? ldStyles.myMessageTextD : ldStyles.myMessageTextL]) : ([darkMode ? ldStyles.theirMessageTextD : ldStyles.theirMessageTextL])}>
                    {(profanityFilter || roomFilter) ? filter.clean(message.text) : message.text}
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
    const handleInputChange = (text) => {
        setInputText(text);
        textRef.current = text;
    };

    const handleContentSizeChange = (event) => {
        setInputHeight(event.nativeEvent.contentSize.height);
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

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[darkMode ? ldStyles.screenD : ldStyles.screenL]} keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}>
            <ScrollView contentContainerStyle={styles.messageListContainer} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                {combinedMessages.map((message, index) => (
                    <View key={index} style={[styles.messageItemContainer, { justifyContent: message.uid === user.uid ? 'flex-end' : 'flex-start' }]}>
                        {message.uid !== user.uid && (<Text style={[styles.senderName]}>{message.senderFName + ' ' + message.senderLName}</Text>)}
                        <View style={[styles.messageBubble, message.uid === user.uid ? ([darkMode ? ldStyles.myMessageD : ldStyles.myMessageL]) : (darkMode ? ldStyles.theirMessageD : ldStyles.theirMessageL)]}>
                            {renderMessageContent(message)}
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={[darkMode ? ldStyles.inputContainerD : ldStyles.inputContainerL]}>
                <TouchableOpacity>
                    <View style={darkMode ? ldStyles.circleButtonD : ldStyles.circleButtonL}>
                        <View>
                            <Menu>
                                <MenuTrigger>
                                    <Feather name="plus" size={24} color="#737373" />
                                </MenuTrigger>
                                <MenuOptions customStyles={{ optionsContainer: darkMode ? ldStyles.mediaMenusStyleD : ldStyles.mediaMenusStyleL }}>
                                    <MenuItem
                                        action={handleSendMedia}
                                        value={null}
                                        icon={<Ionicons name="mail" size={hp(2.5)} color='gray' />}
                                    />
                                    <MenuItem
                                        action={() => showActionSheet(item)}
                                        value={null}
                                        icon={<Ionicons name="mic-circle" size={hp(2.5)} color='gray' />}
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
