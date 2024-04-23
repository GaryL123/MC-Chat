import React, { useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native';
import { useAuth } from './authContext'
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Keyboard } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { OpenAI } from 'openai';
import { getChatId } from './commonLogic';

const messagesRoomLogic = () => {
    const route = useRoute();
    const { roomId, roomName } = route.params;
    const { user } = useAuth(); // logged in user
    const [messages, setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    // const [aiReply, setAiReply] = useState('');
    const scrollViewRef = useRef(null);

    useEffect(() => {
        const docRef = doc(db, "chatRooms", roomId);
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

    const sendMessage = async () => {
        let message = textRef.current.trim();
        if (!message) return;
        try {
            const docRef = doc(db, 'chatRooms', roomId);
            const messagesRef = collection(docRef, "messages");
            textRef.current = "";
            if (inputRef) inputRef?.current?.clear();
            const newDoc = await addDoc(messagesRef, {
                uid: user?.uid,
                text: message,
                senderEmail: user?.email,
                senderFName: user?.fName,
                senderLName: user?.lName,
                createdAt: Timestamp.fromDate(new Date())
            });
        } catch (err) {
            Alert.alert('Message', err.message);
        }
    }

    const sendDoc = async () => {
        console.log('sending doc...');
    }
          
    return { roomId, roomName, user, messages, inputRef, scrollViewRef, updateScrollView, textRef, sendMessage, sendDoc };
}

export default messagesRoomLogic;
