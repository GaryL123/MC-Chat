import React, { useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native';
import { useAuth } from './authContext'
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, runTransaction } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebaseConfig';
import { Keyboard } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { OpenAI } from 'openai';
import { veryBadWords, getChatId } from './commonLogic';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { downloadAsync } from 'expo-file-system';

const messagesLogic = () => {
    const route = useRoute();
    const { item } = route.params;
    const { user } = useAuth(); // logged in user
    const [messages, setMessages] = useState([]);
    const [media, setMedia] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const [recording, setRecording] = useState(null);
    const [recordingURI, setRecordingURI] = useState(null);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        createChatIfNotExists();

        let chatId = getChatId(user?.uid, item?.uid);
        const docRef = doc(db, "chatInds", chatId);
        const messagesRef = collection(docRef, "messages");
        const mediaRef = collection(docRef, "media")
        const q = query(messagesRef, orderBy('createdAt', 'asc'));
        const qm = query(mediaRef, orderBy('createdAt', 'asc'))

        let unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages([...allMessages]);
        });
        let unsubMedia = onSnapshot(qm, (snapshot) => {
            let allMedia = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMedia([...allMedia]);
        });

        const KeyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow', updateScrollView
        )

        return () => {
            unsub();
            unsubMedia();
            KeyboardDidShowListener.remove();
        }

    }, []);

    useEffect(() => {
        updateScrollView();
    }, [messages, media])

    const updateScrollView = () => {
        setTimeout(() => {
            scrollViewRef?.current?.scrollToEnd({ animated: true })
        }, 100)
    }

    const setAudioMode = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true, // Allows recording on iOS
                //interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                playsInSilentModeIOS: true, // Plays audio even if the device is in silent mode
                //interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
                shouldDuckAndroid: true,
                staysActiveInBackground: false,
                playThroughEarpieceAndroid: false,
            });
        } catch (error) {
            console.error("Failed to set audio mode:", error);
        }
    };

    const createChatIfNotExists = async () => {
        let chatId = getChatId(user?.uid, item?.uid);
        await setDoc(doc(db, "chatInds", chatId), {
            chatId,
            createdAt: Timestamp.fromDate(new Date())
        });
    }

    const sendMessage = async () => {
        let message = textRef.current.trim();
        let messageLower = message.toLowerCase();

        if (!message) return;

        const containsVeryBadWord = veryBadWords.some(badWord => messageLower.includes(badWord));

        if (containsVeryBadWord) {
            Alert.alert('Message Not Sent', 'Your message contains inappropriate language.');
            return;
        }

        try {
            let chatId = getChatId(user?.uid, item?.uid);
            const docRef = doc(db, 'chatInds', chatId);
            const messagesRef = collection(docRef, "messages");
            textRef.current = "";

            if (inputRef) {
                inputRef.current?.clear();
            }

            const newDoc = await addDoc(messagesRef, {
                uid: user?.uid,
                text: message,
                senderName: user?.email,
                createdAt: Timestamp.fromDate(new Date())
            });
        } catch (err) {
            console.error("Error sending message: ", err);
            Alert.alert('Message', err.message || 'Failed to send message.');
        }
    };

    const sendMediaMessage = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
            });

            if (result.canceled) {
                return;
            }

            if (result.assets && result.assets.length > 0) {
                const { uri, mimeType, name } = result.assets[0];

                if (uri) {
                    const response = await fetch(uri);
                    const blob = await response.blob();

                    const storage = getStorage();
                    const chatId = getChatId(user?.uid, item?.uid);
                    const mediaRef = storageRef(storage, `chatMedia/${chatId}/${Date.now()}_${name}`);
                    await uploadBytes(mediaRef, blob);

                    const downloadURL = await getDownloadURL(mediaRef);

                    const docRef = doc(db, 'chatInds', chatId);
                    const messagesRef = collection(docRef, 'media');

                    await addDoc(messagesRef, {
                        uid: user?.uid,
                        senderName: user?.email,
                        mediaType: mimeType,
                        mediaURL: downloadURL,
                        fileName: name,
                        createdAt: Timestamp.fromDate(new Date()),
                    });

                } else {
                    console.error('URI was undefined or empty');
                }

            } else {

            }

        } catch (err) {
            Alert.alert('Error', `Failed to send media message: ${err.message}`);
        }
    };
    const requestMicPermission = async () => {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Microphone permission is needed to record audio.');
            return false;
        }
        return true;
    };
    const startRecording = async () => {
        await setAudioMode();
        const permissionGranted = await requestMicPermission();
        if (!permissionGranted) {
            console.log("Microphone permission is required.");
            return;
        }
        try {
            const newRecording = new Audio.Recording();
            await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await newRecording.startAsync();
            console.log("Recording started.");
            setRecording(newRecording);
            // Log after a delay to see if the state has updated
            setTimeout(() => {
                console.log('recording after delay: ', recording);
            }, 100); // 100 ms delay
        }
        catch (error) {
            console.error('Failed to start recording: ', error);
        }
    }
    const stopRecording = async () => {
        if (!recording) {
            console.error('No active recording');
            return null;
        }

        try {
            await recording.stopAndUnloadAsync();
            const recordingURI = recording.getURI();
            setRecording(null);
            setRecordingURI(recordingURI);
            console.log('stopped recording. recordingURI: ', recordingURI);
        } catch (error) {
            console.error('Failed to stop recording: ', error);
            return null;
        }
    };

    const uploadAudio = async (uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const storage = getStorage();
            const chatId = getChatId(user?.uid, item?.uid);
            const mediaRef = storageRef(storage, `chatMedia/${chatId}/${Date.now()}`);

            await uploadBytes(mediaRef, blob);

            const downloadUrl = await getDownloadURL(mediaRef);
            console.log('download url from uloadAudio: ', downloadUrl)
            return downloadUrl;
        } catch (error) {
            console.error('Failed to upload audio: ', error);
        }
    }
    const sendVoiceMessage = async () => {
        if (!recordingURI) { return; }

        const downloadUrl = await uploadAudio(recordingURI);
        if (!downloadUrl) {
            console.error('Failed to get download URL...');
            return;
        }
        try {
            const chatId = getChatId(user?.uid, item?.uid);
            const docRef = doc(db, 'chatInds', chatId);
            const messageRef = collection(docRef, 'media');

            await addDoc(messageRef, {
                uid: user?.uid,
                email: user?.email,
                mediaType: 'audio',
                mediaURL: downloadUrl,
                fileName: 'voiceMessage',
                createdAt: Timestamp.fromDate(new Date()),
            });
            console.log('message sent, uploaded to database')
        } catch (error) {
            console.log('Failed to send voice message: ', error);
        }
    };
    const reportMessage = async (textMessage, chatId, message) => {
        const messageRef = (textMessage ? doc(db, 'chatInds', chatId, 'messages', message.id) : doc(db, 'chatInds', chatId, 'media', message.id));

        try {
            await runTransaction(db, async (transaction) => {
                const msgDoc = await transaction.get(messageRef);
                if (!msgDoc.exists()) {
                    throw new Error("Document does not exist!");
                }

                const data = msgDoc.data();
                const newReportCount = (data.reportCount || 0) + 1;
                let reportedBy = data.reportedBy || [];

                if (reportedBy.includes(user?.uid)) {
                    throw new Error("You have already reported this message.");
                }

                // Add the user to the reportedBy array and update the report count
                reportedBy.push(user?.uid);
                const newText = newReportCount >= 3 ? '*****' : data.text;

                transaction.update(messageRef, {
                    reportCount: newReportCount,
                    reportedBy: reportedBy,
                    text: newText
                });
            });

            Alert.alert('Reported', 'The message has been reported.');
        } catch (err) {
            console.error("Error updating message: ", err);
            Alert.alert('Error', err.message || 'Failed to report the message.');
        }
    };

    const unreportMessage = async (textMessage, chatId, message) => {
        const messageRef = textMessage ? doc(db, 'chatInds', chatId, 'messages', message.id) : doc(db, 'chatInds', chatId, 'media', message.id);

        try {
            await runTransaction(db, async (transaction) => {
                const msgDoc = await transaction.get(messageRef);
                if (!msgDoc.exists()) {
                    throw new Error("Document does not exist!");
                }

                const data = msgDoc.data();
                let newReportCount = data.reportCount || 0;
                let reportedBy = data.reportedBy || [];

                if (!reportedBy.includes(user?.uid)) {
                    throw new Error("You have not reported this message yet.");
                }

                // Remove user from reportedBy array and decrement report count
                reportedBy = reportedBy.filter(id => id !== user?.uid);
                newReportCount = Math.max(0, newReportCount - 1);

                // Update only relevant fields
                const updateData = {
                    reportCount: newReportCount,
                    reportedBy: reportedBy
                };

                // Modify text only if it's a text message and report count is below 3
                if (textMessage) {
                    updateData.text = newReportCount >= 3 ? '*****' : data.text;
                }

                transaction.update(messageRef, updateData);
            });

            Alert.alert('Unreported', 'The report has been removed.');
        } catch (err) {
            console.error("Error updating message: ", err);
            Alert.alert('Error', err.message || 'Failed to unreport the message.');
        }
    };

    const sendDoc = async () => {
        console.log('sending doc...');
    }

    const GPT = async () => {

        const openai = new OpenAI({
            apiKey: "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", // This is the default and can be omitted
        });

        const conversationString = messages.map(message => `${message.senderName.split('@')[0]}: ${message.text}`).join('\n');

        const roleInstruction = `You are chatting with ${item.fName + ' ' + item.lName} in an app called MC-Chat. Please generate a reply that fits the conversation flow and sounds like something a person would naturally say. Match the tone of the conversation and keep responses relevant and engaging. If a question arises that you don't have specific knowledge about (such as dynamic calculations like current events), respond in a way that a person might tactfully handle a similar situation where they lack precise information. Do not mention the username in your reply. Try to keep replies within 50 characters, unless the other person is asking for an elaborate reply.`;

        const user_input = `${roleInstruction}\n\n${conversationString}`;

        // Non-streaming:
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [{ role: 'user', content: user_input }],
        });

        const reply = completion.choices[0]?.message?.content;

        return reply;

        // TO DO - Render input field with the AI reply
    }

    return { item, user, messages, media, inputRef, scrollViewRef, updateScrollView, createChatIfNotExists, textRef, sendMessage, sendMediaMessage, reportMessage, unreportMessage, sendDoc, GPT, startRecording, stopRecording, sendVoiceMessage };
}

export default messagesLogic;
