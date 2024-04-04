import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RoomList from '../../components/RoomItemList';
import { collection, doc, getDocs, getDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db, usersRef } from '../../firebaseConfig';

export default function HomeRooms() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    console.log("home use effect started");
    getRooms();
    
  })

  const getRooms = () => {
    const roomsRef = collection(db,'chatRooms');
    onSnapshot(roomsRef, async (roomSnapshot) => {
        let roomPromises = roomSnapshot.docs.map(docSnap => {
            const roomName = docSnap.name;
            return getDoc(doc(db, 'chatRooms', roomName));
        });

        const roomDocs = await Promise.all(roomPromises);
        const roomData = roomDocs.filter(docSnap => docSnap.exists()).map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
        }));

        setRooms(roomData); // Update the rooms state
    });
};

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {
        rooms.length > 0 ? (
          <RoomList currentUser={user} rooms={rooms} />
        ) : (
          <View className="flex items-center" style={{ top: hp(30) }}>
            <Text>Add some rooms!</Text>
            {/* <ActivityIndicator size="large" /> */}
            {/* <Loading size={hp(10)} /> */}
          </View>
        )
      }

    </View>
  )
}
