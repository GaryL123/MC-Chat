import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform, Button, Alert } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { filter } from '../logic/commonLogic';
import { useSettings } from '../logic/settingsContext';
import MenuItem from '../components/MenuItem';
import messagesLogic from '../logic/messagesLogic';
import ldStyles from '../assets/styles/LightDarkStyles';

const ios = Platform.OS == 'ios';

export default function MessagesScreen() {
    const { language, darkMode, profanityFilter, textSize } = useSettings();
    const { item, user, messages, textRef, inputRef, scrollViewRef, sendMessage, sendDoc, GPT } = messagesLogic();
    const [inputText, setInputText] = useState('');
    const [inputHeight, setInputHeight] = useState(35); 
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

    const handleSendMessage = async () => {
        await sendMessage();
        setInputText("");  
    };

    const handleSendDoc = async () => {
        await sendDoc();
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
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[darkMode ? ldStyles.screenD : ldStyles.screenL, { fontSize: textSize }]} keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}>
            <ScrollView contentContainerStyle={styles.messageListContainer} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                {messages.map((message, index) => (
                    message.uid !== user.uid ? (
                        <Menu key={index}>
                            <MenuTrigger style={[styles.messageItemContainer, { justifyContent: message.uid === user.uid ? 'flex-end' : 'flex-start'}]}>
                                <View style={[styles.messageBubble, message.uid === user.uid ? ([darkMode ? ldStyles.myMessageD : ldStyles.myMessageL, { fontSize: textSize }]) : (darkMode ? ldStyles.theirMessageD : ldStyles.theirMessageL, { fontSize: textSize })]}>
                                    <Text style={message.uid === user.uid ? ([darkMode ? ldStyles.myMessageTextD : ldStyles.myMessageTextL, { fontSize: textSize }]) : ([darkMode ? ldStyles.theirMessageTextD : ldStyles.theirMessageTextL, { fontSize: textSize }])}>
                                        {profanityFilter ? filter.clean(message.text) : message.text}
                                    </Text>
                                </View>
                            </MenuTrigger>
                            <MenuOptions customStyles={{ optionsContainer: [darkMode ? ldStyles.menuReportStyleD : ldStyles.menuReportStyleL, { fontSize: textSize }]}}>
                                <MenuItem text="Report" action={() => handleReportMessage(message)}/>
                            </MenuOptions>
                        </Menu>
                    ) : (
                        <View key={index} style={[styles.messageItemContainer, { justifyContent: 'flex-end' }]}>
                            <View style={[styles.messageBubble, darkMode ? ldStyles.myMessageD : ldStyles.myMessageL, { fontSize: textSize }]}>
                                <Text style={[darkMode ? ldStyles.myMessageTextD : ldStyles.myMessageTextL, { fontSize: textSize }]}>
                                    {profanityFilter ? filter.clean(message.text) : message.text}
                                </Text>
                            </View>
                        </View>
                    )
                ))}
            </ScrollView>
            <View style={[darkMode ? ldStyles.inputContainerD : ldStyles.inputContainerL, { fontSize: textSize }]}>
                <TouchableOpacity onPress={handleSendDoc} style={[darkMode ? ldStyles.circleButtonD : ldStyles.circleButtonL, { fontSize: textSize }]}>
                    <Feather name="plus" size={24} color="#737373" />
                </TouchableOpacity>
                <TextInput
                    onChangeText={handleInputChange}
                    onContentSizeChange={handleContentSizeChange}
                    placeholder='Type a message...'
                    placeholderTextColor={'gray'}
                    style={[darkMode ? ldStyles.textInputD : ldStyles.textInputL, { height: Math.max(35, Math.min(100, inputHeight)) }, { fontSize: textSize }]} // Set min and max height
                    value={inputText}
                    multiline={true} 
                    scrollEnabled={true} 
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
});
