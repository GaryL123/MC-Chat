import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../../components/ChatList';
import Loading from '../../components/Loading';
import { getDocs, query, where } from 'firebase/firestore';
import { usersRef } from '../../firebaseConfig';
import ProfileHeader from '../../components/ProfileHeader';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const router = useRouter();
  useEffect(() => {
    if (user?.uid)
      getUsers();
  }, [])
  
  const getUsers = async () => {
    // fetch users
    const q = query(usersRef, where('uid', '!=', user?.uid));

    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach(doc => {
      data.push({ ...doc.data() });
    });

    setUsers(data);
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <ProfileHeader router={router} />
      {
          <View className="flex items-center" style={{ top: hp(30) }}>
            <Text>Welcome user</Text>
            {/* <ActivityIndicator size="large" /> */}
            {/* <Loading size={hp(10)} /> */}
          </View>
      }
    </View>
  )
}
