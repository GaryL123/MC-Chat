import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from './authContext'
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Keyboard } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getChatId } from './commonLogic';

const messagesLogic = () => {
    const route = useRoute();
    const { item } = route.params;
    const { user } = useAuth(); // logged in user
    const [messages, setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        createChatIfNotExists();

        let chatId = getChatId(user?.uid, item?.uid);
        const docRef = doc(db, "chatInds", chatId);
        const messagesRef = collection(docRef, "messages");
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        let unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map(doc => {
                return doc.data();
            });
            setMessages([...allMessages]);
        });

        const KeyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow', updateScrollView
        )

        return () => {
            unsub();
            KeyboardDidShowListener.remove();
        }

    }, []);

    useEffect(() => {
        updateScrollView();
    }, [messages])

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

    const handleSendMessage = async () => {
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

    return { item, user, messages, textRef, inputRef, scrollViewRef, updateScrollView, createChatIfNotExists, handleSendMessage };
}

export default messagesLogic;
