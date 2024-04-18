// directoryLogic.js
import { useEffect, useState } from 'react';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './authContext';

const directoryLogic = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchFriends();
  }, []);

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
      // Update current user's friendsSent collection
      const currentUserFriendsSentRef = collection(db, 'users', user.uid, 'friendsSent');
      await setDoc(doc(currentUserFriendsSentRef, friendId), { uid: friendId });
  
      // Update recipient's friendsReceived collection
      const recipientFriendsReceivedRef = collection(db, 'users', friendId, 'friendsReceived');
      await setDoc(doc(recipientFriendsReceivedRef, user.uid), { uid: user.uid });

      setSentRequests(prevState => [...prevState, friendId]); // Add friendId to sentRequests

      console.log('Friend request sent successfully.');
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const isFriend = (userId) => {
    return friends.includes(userId);
  };

  return { users, sendFriendRequest, isFriend, sentRequests };
};

export default directoryLogic;
