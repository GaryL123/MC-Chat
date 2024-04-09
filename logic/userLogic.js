import React, { useEffect, useState } from 'react';
import { useAuth } from 'authContext.js';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../../components/ChatList';
import { collection, doc, getDoc, onSnapshot, query, where, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import { FlatList } from 'react-native';

export default function Home() {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        if (user?.uid) {
            getFriends();
        }
    }, [user?.uid]);

    const getFriends = () => {
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
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style="light" />

            {
                friends.length > 0 ? (
                    <ChatList currentUser={user} friends={friends} />
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: hp(30) }}>
                        <Text>Add some friends!</Text>
                    </View>
                )
            }
        </View>
    );
}

export function UserList({ users, currentUser }) {
    const router = useRouter();
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={users}
          contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
          keyExtractor={item => item.email.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => <UserItem
            noBorder={index + 1 === users.length}
            router={router}
            currentUser={currentUser}
            item={item}
            index={index}
          />}
        />
      </View> 
    );
}

export function UserItem({ item, noBorder }) {
    const { user } = useAuth();
    const [friendRequestSent, setFriendRequestSent] = useState(false);

    useEffect(() => {
        const fetchSentFriendRequests = async () => {
            try {
                const sentRequestsQuery = query(collection(doc(db, 'users', user?.uid), 'friendsSent'), where('uid', '==', item?.uid));
                const sentRequestsSnapshot = await getDocs(sentRequestsQuery);
                if (!sentRequestsSnapshot.empty) {
                    setFriendRequestSent(true);
                }
            } catch (error) {
                console.error('Error fetching sent friend requests:', error);
            }
        };
        fetchSentFriendRequests();
    }, [user?.uid, item?.uid]);

    const sendFriendRequest = async () => {
        const friendRequestId = `${user.uid}-${item.uid}`;
        setFriendRequestSent(true);

        await setDoc(doc(db, 'users', item.uid, 'friendsReceived', friendRequestId), {
            uid: user?.uid,
        });
        await setDoc(doc(db, 'users', user.uid, 'friendsSent', friendRequestId), {
            uid: item?.uid,
        });
    }

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 4, alignItems: 'center', marginBottom: 4, paddingBottom: 2, borderBottomWidth: noBorder ? 0 : 1, borderBottomColor: '#BFBFBF' }}>
            <Image
                style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
                source={item?.profileUrl}
                transition={500}
            />

            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: hp(2.0), fontWeight: 'bold', color: '#333333' }}>{item?.fName + ' ' + item?.lName}</Text>
            </View>

            <TouchableOpacity onPress={sendFriendRequest} style={{ padding: 10, backgroundColor: 'green', borderRadius: 5 }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{friendRequestSent ? 'Requested' : 'Add'}</Text>
            </TouchableOpacity>
        </View>
    );
}
