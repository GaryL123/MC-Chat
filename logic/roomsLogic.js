import { useEffect, useState } from 'react'
import { useAuth } from './authContext'
import { collection, doc, addDoc, getDoc, setDoc, updateDoc, onSnapshot, orderBy, query, limit, arrayUnion } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { blurhash, getChatId, formatDate } from './commonLogic';

const roomsLogic = (navigation) => {
    const { user } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [lastMessage, setLastMessage] = useState(undefined);
    const [lastMessages, setLastMessages] = useState({});

    useEffect(() => {
        //console.log("ChatsLogic use effect started");
        if (user?.uid) {
            //console.log("ChatsLogic use effect if statement passed");
            getRooms();
        }
    }, [user?.uid])

    useEffect(() => {
        rooms.forEach(room => {
            //let chatId = getChatId(user?.uid, friend.uid);
            const docRef = doc(db, "chatRooms", room.id);
            //let roomId = room.id;
            const messagesRef = collection(docRef, "messages");
            const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));

            const unsub = onSnapshot(q, (snapshot) => {
                const lastMessage = snapshot.docs.map(doc => doc.data())[0];
                if (lastMessage) {
                    setLastMessages(prev => ({ ...prev, [room.id]: lastMessage }));
                }
            });

            return () => unsub();
        });
    }, [rooms, user?.uid]);

    const getRooms = () => {
        const roomsRef = collection(db, 'chatRooms');

        onSnapshot(roomsRef, async (roomsSnapshot) => {
            let roomPromises = roomsSnapshot.docs.map(docSnap => {
                const roomId = docSnap.id;
                return getDoc(doc(db, 'chatRooms', roomId));
            });

            const roomDocs = await Promise.all(roomPromises);
            const roomsData = roomDocs.filter(docSnap => docSnap.exists()).map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            }));

            setRooms(roomsData); // Update the friends state
        });
    };

    const openRoom = (item) => {
        navigation.navigate('MessagesRoom', { roomId: item.id, roomName: item.roomName });
    }

    const renderTime = (roomId) => {
        const lastMessage = lastMessages[roomId];
        if (lastMessage) {
            let date = lastMessage.createdAt;
            return formatDate(new Date(date.seconds * 1000));
        }
    };

    const renderLastMessage = (roomId) => {
        const lastMessage = lastMessages[roomId];
        if (!lastMessage) return 'Say Hi 👋';

        const messageText = user?.uid === lastMessage.uid ? `You: ${lastMessage.text}` : lastMessage.text;

        return messageText.length > 30 ? `${messageText.slice(0, 30)}...` : messageText;
    };

    const changeRoomPicture = async () => {

    };

    const createRoom = async (roomName, roomDesc, roomPhoto, roomPublic, uid) => {
        try {
            const docRef = await addDoc(collection(db, "chatRooms"), {
                roomName,
                roomDesc,
                roomPhoto,
                roomPublic,
                admins: [uid],
                members: [uid],
            });

            const roomId = docRef.id;

            return { success: true, roomId: docRef.id };
        } catch (e) {
            console.error("Error creating chat room: ", e);
            return { success: false, message: e.message };
        }
    }

    const addUserToRoom = async (roomId, uid) => {
        try {
            const roomRef = doc(db, "chatRooms", roomId);

            await updateDoc(roomRef, {
                members: arrayUnion(uid)
            });

            return { success: true };
        } catch (e) {
            console.error("Error adding user to room: ", e);
            return { success: false, message: e.message };
        }
    }

    const addAdminToRoom = async (roomId, uid) => {
        try {
            const roomRef = doc(db, "chatRooms", roomId);

            await updateDoc(roomRef, {
                admins: arrayUnion(uid)
            });

            return { success: true };
        } catch (e) {
            console.error("Error adding user to room: ", e);
            return { success: false, message: e.message };
        }
    }

    return { user, rooms, renderLastMessage, renderTime, openRoom, createRoom, addUserToRoom, addAdminToRoom, blurhash };
}

export default roomsLogic;
