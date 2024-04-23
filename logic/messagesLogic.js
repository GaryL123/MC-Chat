import React, { useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native';
import { useAuth } from './authContext'
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
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
    const textRef = useRef('');
    const inputRef = useRef(null);
    // const [aiReply, setAiReply] = useState('');
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
            textRef.current = "";
        } catch (err) {
            Alert.alert('Message', err.message);
        }
    }

    const sendDoc = async () => {
        console.log('sending doc...');
    }

    const GPT = async () => {

        const openai = new OpenAI({
            apiKey: "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", // This is the default and can be omitted
        });

        const conversationString = messages.map(message => `${message.senderName.split('@')[0]}: ${message.text}`).join('\n');

        console.log(`${item?.email.split('@')[0]}`);
        const roleInstruction = `
        You are ${user?.fName + ' ' + user?.lName}.
        You are chatting with ${item.fName + ' ' + item.lName} in an app called MC-Chat.
        Below this instruction block you might be provided with a dialogue between the two of you. Each line in the dialogue is marked by your email address or the other person's.
        Your previous lines are preceded by your username which is ${user?.email.split('@')[0]}
        The other person's lines who are you having a conversation with, are preceded by their username which is ${item?.email.split('@')[0]}
        Only respond to lines from ${item?.email.split('@')[0]}
        Generate a reply that fits the conversation flow and sounds as human and natural.
        Match the tone of the conversation and keep responses relevant and engaging.
        If the other person makes a question that you don't have specific knowledge about (such as dynamic calculations like current events), respond in a way that a person might tactfully handle a similar situation where they lack precise information.
        Try to keep replies within 50 characters, unless the other person is asking for an elaborate reply.
        If there are no messages beyond this instruction block, simply start with a greeting to the other person.
        Your incoming response should not be the same format as the dialogue below. Only give a response in a way that someone could read it out in a real conversation and have it make sense. Do no mention the person's username in front of your message.
        `;

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

    return { item, user, messages, inputRef, scrollViewRef, updateScrollView, createChatIfNotExists, textRef, sendMessage, sendDoc, GPT };
}

export default messagesLogic;
