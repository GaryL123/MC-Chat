import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

function MessageLogic() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessagesData();
    }, []);

    const fetchMessagesData = async () => {
        try {
            // Construct the query to fetch messages for the current user
            const q = query(
                collection(db, 'chatInds'), // Assuming messages are stored under 'chatInds' collection
                where('participants', 'array-contains', 'currentUserUID'), // Adjust this condition based on your data structure
                orderBy('createdAt', 'asc') // Assuming messages are ordered by createdAt field
            );

            const querySnapshot = await getDocs(q);
            const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesData);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    return (
        <div>
            {/* Render the messages data here */}
            {messages.map(message => (
                <div key={message.id}>
                    {/* Render each message */}
                    <p>{message.text}</p>
                </div>
            ))}
        </div>
    );
}

export default MessageLogic;
