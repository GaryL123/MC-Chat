import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../../components/ChatList';
import { collection, doc, getDocs, getDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db, usersRef } from '../../firebaseConfig';

export default function Home() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    console.log("home use effect started");
    if (user?.uid) {
      console.log("home use effect if statement passed");
      getFriends();
    }
  }, [user?.uid])

  /*const getUsers = async () => {
    console.log("home Getting users..."); // Confirm the function is called
    const q = query(usersRef, where('uid', '!=', user?.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      console.log("home Fetched users:", data);
      setUsers(data);
    }, (error) => {
      console.error('home Error subscribing to users:', error);
    });

    return unsubscribe;
  };*/

  const getFriends = () => {
    if (!user?.uid) return; // Guard clause if user is not defined

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

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {
        friends.length > 0 ? (
          <ChatList currentUser={user} friends={friends} />
        ) : (
          <View className="flex items-center" style={{ top: hp(30) }}>
            <Text>Add some friends!</Text>
            {/* <ActivityIndicator size="large" /> */}
            {/* <Loading size={hp(10)} /> */}
          </View>
        )
      }

    </View>
  )
}
