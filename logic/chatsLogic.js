import { useEffect, useState } from 'react'
import { useAuth } from './authContext'
import { collection, doc, getDoc, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';

const chatsLogic = (navigation) => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [lastMessage, setLastMessage] = useState(undefined);
    const [lastMessages, setLastMessages] = useState({});
    const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

    useEffect(() => {
        //console.log("ChatsLogic use effect started");
        if (user?.uid) {
            //console.log("ChatsLogic use effect if statement passed");
            getFriends();
        }
    }, [user?.uid])


    useEffect(() => {
        friends.forEach(friend => {
            let chatId = getChatId(user?.uid, friend.uid);
            const docRef = doc(db, "chatInds", chatId);
            const messagesRef = collection(docRef, "messages");
            const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));
    
            const unsub = onSnapshot(q, (snapshot) => {
                const lastMessage = snapshot.docs.map(doc => doc.data())[0];
                if (lastMessage) {
                    setLastMessages(prev => ({ ...prev, [friend.id]: lastMessage }));
                }
            });
    
            return () => unsub();
        });
    }, [friends, user?.uid]);


    const getFriends = () => {
        const friendsRef = collection(db, 'users', user.uid, 'friends');

        onSnapshot(friendsRef, async (friendsSnapshot) => {
            let friendPromises = friendsSnapshot.docs.map(docSnap => {
                const friendUid = docSnap.id;
                return getDoc(doc(db, 'users', friendUid));
            });

            const friendDocs = await Promise.all(friendPromises);
            const friendsData = friendDocs.filter(docSnap => docSnap.exists()).map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            }));

            setFriends(friendsData); // Update the friends state
        });
    };

    const openChat = (item) => {
        navigation.navigate('Messages', { item });
    }

    const renderTime = (friendId) => {
        const lastMessage = lastMessages[friendId];
        if (lastMessage) {
            let date = lastMessage.createdAt;
            return formatDate(new Date(date.seconds * 1000));
        }
    };

    const renderLastMessage = (friendId) => {
        const lastMessage = lastMessages[friendId];
        if (!lastMessage) return 'Say Hi 👋';
        return user?.uid === lastMessage.uid ? `You: ${lastMessage.text}` : lastMessage.text;
    };

    const getChatId = (userId1, userId2) => {
        const sortedIds = [userId1, userId2].sort();
        const chatId = sortedIds.join('-');
        return chatId;
    }

    const formatDate = date => {
        var day = date.getDate();
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var month = monthNames[date.getMonth()];

        var formattedDate = day + ' ' + month;
        return formattedDate;
    }

    //console.log( 'chatsLogic User: ', user, '\n' );
    //console.log( 'chatsLogic Friends: ', friends, '\n' );
    //console.log( 'Last Message: ', lastMessage, '\n' );
    return { user, friends, renderLastMessage, renderTime, openChat, blurhash, getChatId };
}

export default chatsLogic;
