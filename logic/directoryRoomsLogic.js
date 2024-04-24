import { useEffect, useState } from 'react';
import { collection, doc, getDocs, getDoc, deleteDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './authContext';

const directoryRoomsLogic = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [members, setMembers] = useState([]);
    const [roomInvites, setRoomInvites] = useState([]);
    const [sentRoomInvites, setSentRoomInvites] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchRoomInvites();
    }, [user, members, sentRoomInvites]);

    const fetchUserEmail = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid)); // Get the document
            if (userDoc.exists()) {
                const userData = userDoc.data(); // Get the data
                return userData.email; // Return the email
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user email:", error); // Error handling
            return null;
        }
    };

    const fetchUsers = async () => {
        try {
            const usersRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersRef);
            const userData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).filter((userData) => userData.id !== user.uid);
            setUsers(userData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchMembers = async (roomId) => {
        try {
            const roomRef = doc(db, 'chatRooms', roomId);
            const roomDoc = await getDoc(roomRef);
            if (roomDoc.exists()) {
                const roomData = roomDoc.data();
                const memberIds = roomData.members || [];  // Ensure there's a fallback to an empty array if undefined
                setMembers(memberIds);
            } else {
                console.log('No room found with the given ID:', roomId);
                setMembers([]); // Optionally reset to empty if no room data found
            }
        } catch (error) {
            console.error('Error fetching room members:', error);
        }
    };

    const fetchRoomInvites = async () => {
        try {
            // Get the collection of room invites received by the user
            const invitesReceivedRef = collection(db, 'users', user.uid, 'invitesReceived');
            const invitesSnapshot = await getDocs(invitesReceivedRef);
    
            // Prepare an array of promises to fetch invite details
            const invitePromises = invitesSnapshot.docs.map(async (doc) => {
                // Fetch the room ID from the invite data
                const inviteData = doc.data();
                const roomId = inviteData.id; // Assuming this is the room ID
                const senderId = doc.id; // Assuming this is the ID of the sender
                const senderEmail = await fetchUserEmail(senderId); // Get sender email
    
                return {
                    id: senderId, // Sender's user ID
                    roomId: roomId, // Room ID from the invite
                    senderEmail: senderEmail, // Email of the sender
                };
            });
    
            // Resolve all promises to get the complete invite details
            const roomInvites = await Promise.all(invitePromises);
    
            // Set the state with resolved room invite details
            setRoomInvites(roomInvites);
        } catch (error) {
            console.error("Error fetching room invites:", error); // Error handling
        }
    };

    const sendRoomInvite = async (userId, roomId) => {
        try {
            const currentUserInvitesSentRef = collection(db, 'users', user.uid, 'invitesSent');
            await setDoc(doc(currentUserInvitesSentRef, userId), { id: roomId });

            const recipientInvitesReceivedRef = collection(db, 'users', userId, 'invitesReceived');
            await setDoc(doc(recipientInvitesReceivedRef, user.uid), { id: roomId });

            setSentRoomInvites(prevState => [...prevState, userId]);

            console.log('Room invite sent successfully.');
        } catch (error) {
            console.error('Error sending room invite:', error);
        }
    };

    const isMember = (userId) => {
        return members.includes(userId);
    };

    const acceptRoomInvite = async (roomId, senderId) => {
        try {
            console.log(`Accepting room invite for roomId: ${roomId} from senderId: ${senderId}`);
    
            // Check if the room exists
            const roomRef = doc(db, 'chatRooms', roomId);
            const roomDoc = await getDoc(roomRef);
    
            if (!roomDoc.exists()) {
                throw new Error(`Room with ID '${roomId}' does not exist.`);
            }
    
            // Add the current user to the room's 'members' array
            await updateDoc(roomRef, {
                members: arrayUnion(user.uid), // Use arrayUnion to add the user to the array
            });
    
            console.log(`User ${user.uid} added to room ${roomId}'s members`);
    
            // Remove the invite from the user's 'invitesReceived'
            const userInvitesReceivedRef = collection(db, 'users', user.uid, 'invitesReceived');
            await deleteDoc(doc(userInvitesReceivedRef, senderId)); // Use senderId, as it is the reference for the invite
    
            // Remove the invite from the sender's 'invitesSent'
            const senderInvitesSentRef = collection(db, 'users', senderId, 'invitesSent');
            await deleteDoc(doc(senderInvitesSentRef, user.uid));
    
            console.log('Room invite accepted, user added to members, and invite references removed.');
    
        } catch (error) {
            console.error('Error accepting room invite:', error);
        }
    };
    
    

    const rejectRoomInvite = async (roomId, senderId) => {
        try {
            // Remove the invite from the user's 'invitesReceived'
            const userInvitesReceivedRef = collection(db, 'users', user.uid, 'invitesReceived');
            await deleteDoc(doc(userInvitesReceivedRef, senderId)); // Use senderId, as it is the reference for the invite
    
            // Remove the invite from the sender's 'invitesSent'
            const senderInvitesSentRef = collection(db, 'users', senderId, 'invitesSent');
            await deleteDoc(doc(senderInvitesSentRef, user.uid));
    
            console.log("Room invite rejected successfully.");

        } catch (error) {
            console.error("Error rejecting room invite:", error);
        }
    };

    const getOrganizedUsers = () => {
        const membersList = users.filter((u) => members.includes(u.id));
        const otherUsersList = users.filter((u) => !members.includes(u.id));

        return { membersList, otherUsersList };
    };

    const removeMember = async (roomId, userId) => {
        try {
            // Get a reference to the room document
            const roomRef = doc(db, 'chatRooms', roomId);

            // Remove the user from the room's 'members' array
            await updateDoc(roomRef, {
                members: arrayRemove(userId)
            });

            // Update the friends list in the state
            setMembers((prev) => prev.filter((id) => id !== userId));

            console.log('Member removed successfully.');
        } catch (error) {
            console.error('Error removing member:', error);
        }
    };

    return {
        users,
        members,
        fetchMembers,
        isMember,
        sendRoomInvite,
        sentRoomInvites,
        roomInvites,
        removeMember,
        fetchRoomInvites,
        acceptRoomInvite,
        rejectRoomInvite,
        getOrganizedUsers,
    };
};

export default directoryRoomsLogic;
