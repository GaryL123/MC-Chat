import { useEffect, useState } from 'react';
import { collection, doc, getDocs, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
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
            // Get the collection of friend requests
            const requestsRef = collection(db, 'users', user.uid, 'invitesReceived');
            const requestsSnapshot = await getDocs(requestsRef);

            // Prepare an array of promises to fetch user emails
            const emailPromises = requestsSnapshot.docs.map(async (doc) => {
                const senderEmail = await fetchUserEmail(doc.id); // Fetch email asynchronously
                return {
                    id: doc.id,
                    senderEmail: senderEmail, // Expected resolved email
                };
            });

            // Wait for all promises to resolve
            const requestDetails = await Promise.all(emailPromises);

            setRoomInvites(requestDetails); // Set the state with resolved details
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
            // Get a reference to the room document
            const roomRef = doc(db, 'chatRooms', roomId);
            const roomDoc = await getDoc(roomRef);
            if (!roomDoc.exists()) {
                throw new Error(`Room with ID/Name '${roomId}' does not exist.`);
              }

            // Add the current user to the room's 'members' array
            await updateDoc(roomDoc, {
                members: arrayUnion(user.uid)
            });

            // Remove the invite from the user's 'invitesReceived'
            const userInvitesReceivedRef = doc(db, 'users', user.uid, 'invitesReceived', roomId);
            await deleteDoc(userInvitesReceivedRef);

            // Remove the invite from the sender's 'invitesSent'
            const senderInvitesSentRef = doc(db, 'users', senderId, 'invitesSent', roomId);
            await deleteDoc(senderInvitesSentRef);

            console.log('Room invite accepted successfully.');

            // Optionally refresh the room invites list if this is managed in state
            if (fetchRoomInvites) fetchRoomInvites();
        } catch (error) {
            console.error('Error accepting room invite:', error);
        }
    };

    const rejectRoomInvite = async (roomId, senderId) => {
        try {
            // Remove invite from user's 'invitesReceived'
            const userInvitesReceivedRef = collection(db, 'users', user.uid, 'invitesReceived');
            await deleteDoc(doc(userInvitesReceivedRef, roomId));

            // Remove invite from sender's 'invitesSent'
            const senderInvitesSentRef = collection(db, 'users', senderId, 'invitesSent');
            await deleteDoc(doc(senderInvitesSentRef, roomId));

            console.log("Room invite rejected successfully.");

            // Refresh friend requests
            fetchRoomInvites();
        } catch (error) {
            console.error("Error rejecting room invite:", error);
        }
    };

    const getOrganizedUsers = () => {
        const membersList = users.filter((u) => members.includes(u.id));
        const otherUsersList = users.filter((u) => !members.includes(u.id));

        return { membersList, otherUsersList };
    };

    const removeMember = async (userId) => {
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
