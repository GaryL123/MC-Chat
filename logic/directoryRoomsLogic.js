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
    }, [sentRoomInvites, roomInvites]);

    const fetchUserEmail = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return userData.email;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user email:", error);
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
                const memberIds = roomData.members || [];
                setMembers(memberIds);
            } else {
                setMembers([]);
            }
        } catch (error) {
            console.error('Error fetching room members:', error);
        }
    };

    const fetchRoomInvites = async () => {
        try {
            const invitesReceivedRef = collection(db, 'users', user.uid, 'invitesReceived');
            const invitesSnapshot = await getDocs(invitesReceivedRef);

            const invitePromises = invitesSnapshot.docs.map(async (doc) => {
                const inviteData = doc.data();
                const roomId = inviteData.id;
                const senderId = doc.id;
                const senderEmail = await fetchUserEmail(senderId);

                return {
                    id: senderId,
                    roomId: roomId,
                    senderEmail: senderEmail,
                };
            });

            const roomInvites = await Promise.all(invitePromises);

            setRoomInvites(roomInvites);
        } catch (error) {
            console.error("Error fetching room invites:", error);
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
            const roomRef = doc(db, 'chatRooms', roomId);
            const roomDoc = await getDoc(roomRef);

            if (!roomDoc.exists()) {
                throw new Error(`Room with ID '${roomId}' does not exist.`);
            }

            await updateDoc(roomRef, {
                members: arrayUnion(user.uid),
            });

            const userInvitesReceivedRef = collection(db, 'users', user.uid, 'invitesReceived');
            await deleteDoc(doc(userInvitesReceivedRef, senderId));

            const senderInvitesSentRef = collection(db, 'users', senderId, 'invitesSent');
            await deleteDoc(doc(senderInvitesSentRef, user.uid));

        } catch (error) {
            console.error('Error accepting room invite:', error);
        }
    };



    const rejectRoomInvite = async (roomId, senderId) => {
        try {
            const userInvitesReceivedRef = collection(db, 'users', user.uid, 'invitesReceived');
            await deleteDoc(doc(userInvitesReceivedRef, senderId));

            const senderInvitesSentRef = collection(db, 'users', senderId, 'invitesSent');
            await deleteDoc(doc(senderInvitesSentRef, user.uid));

        } catch (error) {
            console.error("Error rejecting room invite:", error);
        }
    };

    const getOrganizedUsers = () => {
        const membersList = users.filter((u) => members.includes(u.id));
        const otherUsersList = users.filter((u) => !members.includes(u.id));

        return { membersList, otherUsersList };
    };

    const addAdmin = async (roomId, userId) => {
        try {
            const roomRef = doc(db, 'chatRooms', roomId);

            await updateDoc(roomRef, {
                admins: arrayUnion(userId)
            });

            setMembers((prev) => prev.filter((id) => id !== userId));

        } catch (error) {
            console.error('Error adding admin:', error);
        }
    };

    const removeMember = async (roomId, userId) => {
        try {
            const roomRef = doc(db, 'chatRooms', roomId);

            await updateDoc(roomRef, {
                members: arrayRemove(userId)
            });

            setMembers((prev) => prev.filter((id) => id !== userId));

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
        addAdmin,
        removeMember,
        fetchRoomInvites,
        acceptRoomInvite,
        rejectRoomInvite,
        getOrganizedUsers,
    };
};

export default directoryRoomsLogic;
