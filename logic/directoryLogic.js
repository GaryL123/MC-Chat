// directoryLogic.js
import { useEffect, useState } from 'react';
import { collection, doc, getDocs, getDoc,deleteDoc,  setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './authContext';

const directoryLogic = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchFriends();
        fetchFriendRequests();
    }, []);

    const fetchUserEmail = async (uid) => {
        try {
            console.log("Getting user document for UID:", uid); // Debug the UID
            const userDoc = await getDoc(doc(db, 'users', uid)); // Get the document
            if (userDoc.exists()) {
                const userData = userDoc.data(); // Get the data
                console.log("User data fetched:", userData); // Log user data
                return userData.email; // Return the email
            } else {
                console.error("User not found for UID:", uid); // Handle case when user doesn't exist
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
            }));
            setUsers(userData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchFriendRequests = async () => {
        try {
            // Get the collection of friend requests
            const requestsRef = collection(db, 'users', user.uid, 'friendsReceived');
            const requestsSnapshot = await getDocs(requestsRef);
    
            // Prepare an array of promises to fetch user emails
            const emailPromises = requestsSnapshot.docs.map(async (doc) => {
                console.log("Fetching email for", doc.id); // Log the user ID
                const senderEmail = await fetchUserEmail(doc.id); // Fetch email asynchronously
                console.log("Fetched email:", senderEmail); // Debug log to see if it's undefined
                return {
                    id: doc.id,
                    senderEmail: senderEmail, // Expected resolved email
                };
            });
    
            // Wait for all promises to resolve
            const requestDetails = await Promise.all(emailPromises);
    
            console.log("Resolved friend request details:", requestDetails); // Debug the results
            setFriendRequests(requestDetails); // Set the state with resolved details
        } catch (error) {
            console.error("Error fetching friend requests:", error); // Error handling
        }
    };
    
    
    

    const fetchFriends = async () => {
        try {
            const friendsRef = collection(db, 'users', user.uid, 'friends');
            const friendsSnapshot = await getDocs(friendsRef);
            const friendIds = friendsSnapshot.docs.map(doc => doc.id);
            setFriends(friendIds);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const sendFriendRequest = async (friendId) => {
        try {
            const currentUserFriendsSentRef = collection(db, 'users', user.uid, 'friendsSent');
            await setDoc(doc(currentUserFriendsSentRef, friendId), { uid: friendId });

            const recipientFriendsReceivedRef = collection(db, 'users', friendId, 'friendsReceived');
            await setDoc(doc(recipientFriendsReceivedRef, user.uid), { uid: user.uid });

            setSentRequests(prevState => [...prevState, friendId]);

            console.log('Friend request sent successfully.');
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };
    
    const isFriend = (userId) => {
        return friends.includes(userId);
    };

    const acceptFriendRequest = async (friendId) => {
        try {
            // Add friend to current user's 'friends' collection
            const currentUserFriendsRef = collection(db, 'users', user.uid, 'friends');
            await setDoc(doc(currentUserFriendsRef, friendId), { uid: friendId });

            // Add current user to friend's 'friends' collection
            const friendUserFriendsRef = collection(db, 'users', friendId, 'friends');
            await setDoc(doc(friendUserFriendsRef, user.uid), { uid: user.uid });

            // Remove friend request from 'friendsReceived'
            const currentUserFriendsReceivedRef = collection(db, 'users', user.uid, 'friendsReceived');
            await deleteDoc(doc(currentUserFriendsReceivedRef, friendId));

            // Remove friend request from 'friendsSent' in the friend's account
            const friendFriendsSentRef = collection(db, 'users', friendId, 'friendsSent');
            await deleteDoc(doc(friendFriendsSentRef, user.uid));

            console.log('Friend request accepted successfully.');

            // Refresh the friend requests after acceptance
            await fetchFriendRequests();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };
    const rejectFriendRequest = async (friendId) => {
        try {
            // Remove from current user's 'friendsReceived'
            const currentUserRequestDoc = doc(db, 'users', user.uid, 'friendsReceived', friendId);
            await deleteDoc(currentUserRequestDoc);

            // Remove from sender's 'friendsSent'
            const senderRequestDoc = doc(db, 'users', friendId, 'friendsSent', user.uid);
            await deleteDoc(senderRequestDoc);

            console.log("Friend request rejected successfully.");

            // Refresh friend requests
            fetchFriendRequests();
        } catch (error) {
            console.error("Error rejecting friend request:", error);
        }
    };

    return {
        users,
        friends,
        isFriend,
        sendFriendRequest,
        sentRequests,
        friendRequests,
        fetchFriendRequests,
        acceptFriendRequest,
        rejectFriendRequest
    };
};

export default directoryLogic;
