import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../../components/ChatList';
import { query, where, onSnapshot } from 'firebase/firestore';
import { usersRef } from '../../firebaseConfig';

export default function Home() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("home use effect started");
    if (user?.uid) {
      console.log("home use effect if statement passed");
      getUsers();
    }
  }, [user?.uid])

  const getUsers = async () => {
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
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {
        users.length > 0 ? (
          <ChatList currentUser={user} users={users} />
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
