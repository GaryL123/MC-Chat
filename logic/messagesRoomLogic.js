import React, { useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native';
import { useAuth } from './authContext'
import { Timestamp, addDoc, collection, doc, getDoc, getDocs, deleteDoc, onSnapshot, orderBy, query, setDoc, writeBatch, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Keyboard } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { OpenAI } from 'openai';
import { getChatId } from './commonLogic';

const messagesRoomLogic = () => {
    const route = useRoute();
    const { roomId, roomPhoto, roomName, roomDesc, roomFilter, roomPublic } = route.params;
    const { user } = useAuth(); // logged in user
    const [messages, setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    // const [aiReply, setAiReply] = useState('');
    const scrollViewRef = useRef(null);
    const [isAdmin, setIsAdmin] = useState(false);

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
        const roomRef = doc(db, 'chatRooms', roomId);
        const unsub = onSnapshot(roomRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setIsAdmin(data.admins && data.admins.includes(user?.uid));
            } else {
                setIsAdmin(false);
            }
        });
    
        return () => unsub();
    }, [roomId, user.uid]);

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

    const leaveRoom = async (roomId) => {
        try {
            const roomRef = doc(db, 'chatRooms', roomId);
            const roomSnap = await getDoc(roomRef);
    
            if (!roomSnap.exists()) {
                return;
            }
    
            const roomData = roomSnap.data();
    
            if (roomData.members.length === 1) {
                const messagesRef = collection(roomRef, "messages");
                const snapshot = await getDocs(messagesRef);
                const batch = writeBatch(db);

                snapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });

                await batch.commit();
                await deleteDoc(roomRef);
            } else {
                await updateDoc(roomRef, {
                    members: arrayRemove(user?.uid)
                });
            }
        } catch (error) {
            console.error('Error removing member or deleting room:', error);
            throw error;
        }
    }
          
    return { roomId, roomPhoto, roomName, roomDesc, roomFilter, roomPublic, user, messages, inputRef, scrollViewRef, updateScrollView, textRef, sendMessage, sendDoc, isAdmin, leaveRoom };
}

export default messagesRoomLogic;
