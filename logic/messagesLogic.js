import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native';
import { useAuth } from './authContext'
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebaseConfig';
import { Keyboard } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { OpenAI } from 'openai';
import { getChatId } from './commonLogic';
const messagesLogic = () => {
    const route = useRoute();
    const { item } = route.params;
    const { user } = useAuth(); // logged in user
    const [messages, setMessages] = useState([]);
    const [media, setMedia] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    // const [aiReply, setAiReply] = useState('');
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
            let allMessages = snapshot.docs.map(doc => {
                return doc.data();
            });
            setMessages([...allMessages]);
        });
        let unsubMedia = onSnapshot(qm, (snapshot) => {
            let allMedia = snapshot.docs.map(doc => {
                return doc.data();
            });
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

    const createChatIfNotExists = async () => {
        let chatId = getChatId(user?.uid, item?.uid);
        await setDoc(doc(db, "chatInds", chatId), {
            chatId,
            createdAt: Timestamp.fromDate(new Date())
        });
    }

    const sendMessage = async () => {
        let message = textRef.current.trim();
        if (!message) return;
        try {
            let chatId = getChatId(user?.uid, item?.uid);
            const docRef = doc(db, 'chatInds', chatId);
            const messagesRef = collection(docRef, "messages");
            textRef.current = "";
            if (inputRef) inputRef?.current?.clear();
            const newDoc = await addDoc(messagesRef, {
                uid: user?.uid,
                text: message,
                senderName: user?.email,
                createdAt: Timestamp.fromDate(new Date())
            });
        } catch (err) {
            Alert.alert('Message', err.message);
        }
    }

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

    const reportMessage = async (message) => {

    }


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

    return { item, user, messages, media, inputRef, scrollViewRef, updateScrollView, createChatIfNotExists, textRef, sendMessage, sendMediaMessage, reportMessage, sendDoc, GPT };
}

export default messagesLogic;
