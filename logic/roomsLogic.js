import { useEffect, useState } from 'react'
import { useAuth } from './authContext'
import * as ImagePicker from 'expo-image-picker';
import { collection, doc, addDoc, getDoc, setDoc, updateDoc, onSnapshot, orderBy, query, limit, arrayUnion } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebaseConfig';
import { blurhash, getChatId, formatDate, defaultProfilePicture } from './commonLogic';
import { getAuth, updateProfile } from "firebase/auth";

const roomsLogic = (navigation) => {
    const { user } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState(null);
    const [lastMessage, setLastMessage] = useState(undefined);
    const [lastMessages, setLastMessages] = useState({});
    const [selectedImageUri, setSelectedImageUri] = useState(null);

    useEffect(() => {
        //console.log("ChatsLogic use effect started");
        if (user?.uid) {
            //console.log("ChatsLogic use effect if statement passed");
            getRooms();
        }
    }, [user?.uid])

    useEffect(() => {
        rooms.forEach(room => {
            const docRef = doc(db, "chatRooms", room.id);
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

    const chooseRoomPicture = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your photos!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.cancelled) {
            //console.log(result);
            const { uri } = result.assets[0];
            //console.log(uri);
            if (uri) {
                setSelectedImageUri(uri);
            } else {
                console.error('No URI found in result object:', result);
            }
        }
    };

    const chooseRoomPicture2 = async (roomId) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your photos!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.cancelled) {
            //console.log(result);
            const { uri } = result.assets[0];
            //console.log(uri);
            if (uri) {
                return await changeRoomPicture(roomId, uri);
            } else {
                console.error('No URI found in result object:', result);
            }
        }
    };

    const changeRoomPicture = async (roomId, uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const storage = getStorage();
            const roomPicRef = storageRef(storage, `roomPictures/${roomId}`);

            await uploadBytes(roomPicRef, blob);

            const downloadURL = await getDownloadURL(roomPicRef);

            const roomRef = doc(db, "chatRooms", roomId);
            await updateDoc(roomRef, { roomPhoto: downloadURL });

            const auth = getAuth();
            await updateProfile(auth.currentUser, {
                roomPhoto: downloadURL
            });

            setRoom(prev => ({
                ...prev,
                roomPhoto: downloadURL
            }));

            return downloadURL;
        } catch (error) {
            console.error("Error uploading room picture: ", error);
            alert("Error uploading room picture: " + error.message);
        }
    };

    const getRooms = async () => {
        const roomsRef = collection(db, 'chatRooms');

        // Subscribe to changes on rooms
        onSnapshot(roomsRef, async (roomsSnapshot) => {
            let roomsData = [];
            roomsSnapshot.forEach(docSnap => {
                let roomData = docSnap.data();
                roomData.id = docSnap.id;

                // Check if room is public or if the user is a member of the room
                if (roomData.roomPublic || roomData.members.includes(user.uid)) {
                    roomsData.push(roomData);
                }
            });

            setRooms(roomsData); // Update the rooms state
        });
    };

    const openRoom = (item) => {
        navigation.navigate('MessagesRoom', { roomId: item.id, roomPhoto: item.roomPhoto, roomName: item.roomName, roomDesc: item.roomDesc, roomFilter: item.roomFilter, roomPublic: item.roomPublic });
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

    const createRoom = async (roomName, roomDesc, roomFilter, roomPublic, uid) => {
        try {
            const docRef = await addDoc(collection(db, "chatRooms"), {
                roomName,
                roomDesc,
                roomPhoto: defaultProfilePicture,
                roomFilter,
                roomPublic,
                admins: [uid],
                members: [uid],
            });

            if (selectedImageUri) {
                const response = await fetch(selectedImageUri);
                const blob = await response.blob();
                const storage = getStorage();
                const roomProfilePicRef = storageRef(storage, `roomPictures/${docRef.id}`); // Use the newly created room ID for the image path
    
                await uploadBytes(roomProfilePicRef, blob);
                const downloadURL = await getDownloadURL(roomProfilePicRef);
    
                // Update the room document with the actual photo URL
                await updateDoc(doc(db, "chatRooms", docRef.id), {
                    roomPhoto: downloadURL
                });
            }

            navigation.navigate('Rooms');
        } catch (e) {
            console.error("Error creating chat room: ", e);
        }
    }

    const changeRoomName = async (roomId, roomName) => {
        const roomRef = doc(db, "chatRooms", roomId);
        await updateDoc(roomRef, { roomName: roomName });
        setRoom(prev => ({ ...prev, roomName: roomName }));
    };

    const changeRoomDesc = async (roomId, roomDesc) => {
        const roomRef = doc(db, "chatRooms", roomId);
        await updateDoc(roomRef, { roomDesc: roomDesc });
        setRoom(prev => ({ ...prev, roomDesc: roomDesc }));
    };

    const changeRoomFilter = async (roomId, roomFilter) => {
        const roomRef = doc(db, "chatRooms", roomId);
        await updateDoc(roomRef, { roomFilter: roomFilter });
        setRoom(prev => ({ ...prev, roomFilter: roomFilter }));
    };

    const changeRoomPublic = async (roomId, roomPublic) => {
        const roomRef = doc(db, "chatRooms", roomId);
        await updateDoc(roomRef, { roomPublic: roomPublic });
        setRoom(prev => ({ ...prev, roomPublic: roomPublic }));
    };

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

    return { user, rooms, selectedImageUri, setSelectedImageUri, chooseRoomPicture, chooseRoomPicture2, renderLastMessage, renderTime, openRoom, createRoom, changeRoomName, changeRoomDesc, changeRoomFilter, changeRoomPublic, addUserToRoom, addAdminToRoom, blurhash };
}

export default roomsLogic;